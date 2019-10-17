from django.shortcuts import render, get_object_or_404, HttpResponseRedirect, reverse, Http404 ,HttpResponse
from django.views import generic
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings
import os ,random ,datetime

from . import models
from . import forms
from expert.models import ResearchQuestion

faBaseNum = {

    1: 'یک',
    2: 'دو',
    3: 'سه',
    4: 'چهار',
    5: 'پنج',
    6: 'شش',
    7: 'هفت',
    8: 'هشت',
    9: 'نه',
    10: 'ده',
    11: 'یازده',
    12: 'دوازده',
    13: 'سیزده',
    14: 'چهارده',
    15: 'پانزده',
    16: 'شانزده',
    17: 'هفده',
    18: 'هجده',
    19: 'نوزده',
    20: 'بیست',
    30: 'سی',
    40: 'چهل',
    50: 'پنجاه',
    60: 'شصت',
    70: 'هفتاد',
    80: 'هشتاد',
    90: 'نود',
    100: 'صد',
    200: 'دویست',
    300: 'سیصد',
    500: 'پانصد'
}
faBaseNumKeys = faBaseNum.keys()
faBigNum = ["یک", "هزار", "میلیون", "میلیارد"]
faBigNumSize = len(faBigNum)


def split3(st):
    parts = []
    n = len(st)
    d, m = divmod(n, 3)
    for i in range(d):
        parts.append(int(st[n - 3 * i - 3:n - 3 * i]))
    if m > 0:
        parts.append(int(st[:m]))
    return parts


def convert(st):
    if isinstance(st, int):
        st = str(st)
    elif not isinstance(st, str):
        raise TypeError('bad type "%s"' % type(st))
    if len(st) > 3:
        parts = split3(st)
        k = len(parts)
        wparts = []
        for i in range(k):
            faOrder = ''
            p = parts[i]
            if p == 0:
                continue
            if i == 0:
                wpart = convert(p)
            else:
                if i < faBigNumSize:
                    faOrder = faBigNum[i]
                else:
                    faOrder = ''
                    (d, m) = divmod(i, 3)
                    t9 = faBigNum[3]
                    for j in range(d):
                        if j > 0:
                            faOrder += "‌"
                        faOrder += t9
                    if m != 0:
                        if faOrder != '':
                            faOrder = "‌" + faOrder
                        faOrder = faBigNum[m] + faOrder
                wpart = faOrder if i == 1 and p == 1 else convert(p) + " " + faOrder
            wparts.append(wpart)
        return " و ".join(reversed(wparts))
    n = int(st)
    if n in faBaseNumKeys:
        return faBaseNum[n]
    y = n % 10
    d = int((n % 100) / 10)
    s = int(n / 100)
    dy = 10 * d + y
    fa = ''
    if s != 0:
        if s * 100 in faBaseNumKeys:
            fa += faBaseNum[s * 100]
        else:
            fa += (faBaseNum[s] + faBaseNum[100])
        if d != 0 or y != 0:
            fa += ' و '
    if d != 0:
        if dy in faBaseNumKeys:
            fa += faBaseNum[dy]
            return fa
        fa += faBaseNum[d * 10]
        if y != 0:
            fa += ' و '
    if y != 0:
        fa += faBaseNum[y]
    return fa


class Index(LoginRequiredMixin, generic.FormView):
    template_name = 'researcher/index.html'
    form_class = forms.InitialInfoForm
    login_url = '/login/'

    # def get(self, request, *args, **kwargs):
    # #     try:
    # #         self.researcher = get_object_or_404(models.ResearcherUser, user=request.user)
    # #     except:
    # #         return HttpResponseRedirect(reverse('chamran:login'))
    # #     # print(self.researcher.status.status)
    # #     # if self.researcher.status.status == 'signed_up':
    # #     #     return super().get(request, *args, **kwargs)
    #     return render(request, 'researcher/index.html', self.get_context_data())

    def get(self, request, *args, **kwargs):
        try:
            models.ResearcherUser.objects.get(user=request.user)
        except models.ResearcherUser.DoesNotExist:
            raise Http404('.کاربر پژوهشگر مربوطه یافت نشد')
        return super().get(self, request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context =  super().get_context_data(**kwargs)
        if self.request.user.researcheruser.researchquestioninstance_set.all().count() > 0:
            context['question_instance'] = "True"
            context['uuid'] = self.request.user.researcheruser.researchquestioninstance_set.all().reverse()[0].research_question.uniqe_id
        return context

    def post(self, request, *args, **kwargs):
        researcher = get_object_or_404(models.ResearcherUser, user=request.user)
        form = forms.InitialInfoForm(request.POST, request.FILES)
        if form.is_valid():
            researcher_profile = form.save(commit=False)
            researcher_profile.researcher_user = researcher
            researcher_profile.save()
            if request.FILES.get('photo'):
                photo = request.FILES.get('photo')
                researcher_profile.photo.save(photo.name, photo)
            status = models.Status.objects.get(researcher_user=researcher)
            status.status = 'not_answered'
            status.save()
            return HttpResponseRedirect(reverse('researcher:index'))

        return super().post(self, request, *args, **kwargs)


class UserInfo(generic.TemplateView):
    template_name = 'researcher/userInfo.html'
    form_class = forms.ResearcherProfileForm


    def get(self, request, *args, **kwargs):
        if (not self.request.user.is_authenticated) or (not models.ResearcherUser.objects.filter(user=self.request.user).count()):
            return HttpResponseRedirect(reverse('chamran:login'))
        try:
            self.request.user.researcheruser.researcherprofile
        except:
            return HttpResponseRedirect(reverse("researcher:index"))    
        return super().get(request, *args, **kwargs)    

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["form"] = forms.ResearcherProfileForm(self.request.user,
                                           instance=self.request.user.researcheruser.researcherprofile,
                                           initial={
                                                'grade':
                                                    self.request.user.researcheruser.researcherprofile.grade,
                                                'email':
                                                    self.request.user.username})
        # context = {
        #             'form' :  forms.ResearcherProfileForm(self.request.user,
        #                                    instance=self.request.user.researcheruser.researcherprofile,
        #                                    initial={
        #                                         'grade':
        #                                             self.request.user.researcheruser.researcherprofile.grade,
        #                                         'email':
        #                                             self.request.user.username})
        #             }
        context['scientificrecord_set'] = self.request.user.researcheruser.researcherprofile.scientificrecord_set.all()
        context['executiverecord_set'] = self.request.user.researcheruser.researcherprofile.executiverecord_set.all()
        context['studiousrecord_set'] = self.request.user.researcheruser.researcherprofile.studiousrecord_set.all()
        if self.request.user.researcheruser.researchquestioninstance_set.all().count() > 0:
            context['question_instance'] = "True"
            context['uuid'] = self.request.user.researcheruser.researchquestioninstance_set.all().reverse()[0].research_question.uniqe_id 
        return context

    def post(self, request, *args, **kwargs):        
        form = forms.ResearcherProfileForm(self.request.user ,request.POST, request.FILES,
                                        #    initial={
                                        #        'grade':
                                        #            self.request.user.researcheruser.researcherprofile.grade})
        )
        print(self.request.POST)
        if form.is_valid():
            profile = request.user.researcheruser.researcherprofile
            if form.cleaned_data['photo'] is not None:
                if profile.photo:
                    if os.path.isfile(profile.photo.path):
                        os.remove(profile.photo.path)
                    profile.photo = form.cleaned_data['photo']
                else:
                    profile.photo = form.cleaned_data['photo']
            profile.address = form.cleaned_data['address']
            profile.email = form.cleaned_data['email']
            profile.home_number = form.cleaned_data['home_number']
            profile.phone_number = form.cleaned_data['phone_number']
            profile.grade = form.cleaned_data['grade']
            if form.cleaned_data['team_work'] is not None:
                profile.team_work = form.cleaned_data['team_work']
            if form.cleaned_data['creative_thinking'] is not None:
                profile.creative_thinking = form.cleaned_data['creative_thinking']
            if form.cleaned_data['interest_in_major'] is not None:
                profile.interest_in_major = form.cleaned_data['interest_in_major']
            if form.cleaned_data['motivation'] is not None:
                profile.motivation = form.cleaned_data['motivation']
            if form.cleaned_data['sacrifice'] is not None:
                profile.sacrifice = form.cleaned_data['sacrifice']
            if form.cleaned_data['diligence'] is not None:
                profile.diligence = form.cleaned_data['diligence']
            if form.cleaned_data['interest_in_learn'] is not None:
                profile.interest_in_learn = form.cleaned_data['interest_in_learn']
            if form.cleaned_data['punctuality'] is not None:
                profile.punctuality = form.cleaned_data['punctuality']
            if form.cleaned_data['data_collection'] is not None:
                profile.data_collection = form.cleaned_data['data_collection']
            if form.cleaned_data['project_knowledge'] is not None:
                profile.project_knowledge = form.cleaned_data['project_knowledge']
            profile.description = form.cleaned_data['description']

            profile.save()
            return HttpResponseRedirect(reverse("researcher:index"))
        context=self.get_context_data(**kwargs)
        
        if form.errors['home_number']:
            context['home_number_error'] = form.errors['home_number']

        if form.errors['phone_number']:
            context['phone_number_error'] = form.errors['phone_number']

        return render(request ,'researcher/userInfo.html' ,context=context)

def ajax_ScientificRecord(request):    
    form = forms.ScientificRecordForm(request.POST)
    if form.is_valid():
        scientific_record = form.save(commit=False)
        scientific_record.researcherProfile = request.user.researcheruser.researcherprofile
        scientific_record.save()
        data = {
            'success' : 'successful',
        }
        return JsonResponse(data)
    else:
        print("error happened")
        return JsonResponse(form.errors ,status=400)

def ajax_ExecutiveRecord(request):
    form = forms.ExecutiveRecordForm(request.POST)
    if form.is_valid():
        executive_record = form.save(commit=False)
        executive_record.researcherProfile = request.user.researcheruser.researcherprofile
        executive_record.save()
        data = {
            'success' : 'successful',
        }
        return JsonResponse(data)
    else:
        print("error happened")
        return JsonResponse(form.errors ,status=400)

def ajax_StudiousRecord(request):
    form = forms.StudiousRecordForm(request.POST)
    if form.is_valid():
        studious_record = form.save(commit=False)
        studious_record.researcherProfile = request.user.researcheruser.researcherprofile
        studious_record.save()
        data = {
            'success' : 'successful',
        }
        return JsonResponse(data)
    else:
        return JsonResponse(form.errors ,status=400)

def signup(request, username):
    user = get_object_or_404(User, username=username)
    researcher = models.ResearcherUser(user=user)
    researcher.save()
    return HttpResponseRedirect(reverse('researcher:index'))


class Messages(generic.TemplateView):
    template_name = 'researcher/messages.html'

class Technique(generic.TemplateView):
    template_name = 'researcher/technique.html'

    def get(self, request, *args, **kwargs):
        print("----------")
        if (not request.user.is_authenticated) or (not models.ResearcherUser.objects.filter(user=request.user).count()):
            return HttpResponseRedirect(reverse('chamran:login'))
        try:
           researcher = models.ResearcherUser.objects.get(user=request.user)
        except models.ResearcherUser.DoesNotExist:
            raise Http404('.کاربر پژوهشگر مربوطه یافت نشد')
        return render(request ,self.template_name ,context=self.get_context_data(**kwargs))

    def get_context_data(self, **kwargs):
        context =  super().get_context_data(**kwargs)
        context['technique_list'] = self.request.user.researcheruser.techniqueinstance_set.all()
        return context

    def post(self ,request ,*args, **kwargs):
        print(self.request.POST)
        form = forms.TechniqueInstance(request.POST)
        if form.is_valid():
            technique_title = form.cleaned_data['technique']
            method = request.POST['confirmation_method']
            if method == 'exam':
                method_fa = "درخواست آزمون آنلاین"
            elif method == 'certificant':
                method_fa = "گواهی نامه"
            else:
                method_fa = "مقاله"
            subject = 'Technique Validation'
            message ="""کاربر به نام کاربری {} و به نام {} {} ، تکنیک {} را افزوده است.
            برای ارزیابی گزینه {} را انتخاب کرده است. لطفا {}را ارزیابی کنید و نتیجه را اعلام کنید.
            با تشکر""".format(self.request.user.username ,self.request.user.researcheruser.researcherprofile.first_name,
                            self.request.user.researcheruser.researcherprofile.last_name,
                            technique_title ,method_fa ,self.request.user.username)
            try:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[settings.EMAIL_HOST_USER ,'a.jafarzadeh1998@gmail.com',],
                    fail_silently=False
                )
            except TimeoutError:
                return HttpResponse('Timeout Error!!')
            try:
                technique = get_object_or_404(models.Technique ,technique_title=technique_title)
            except:
                technique_type = TECHNIQUES[technique_title]
                technique = models.Technique(technique_type=technique_type ,technique_title=technique_title)
                technique.save()
            if method == 'exam':
                level = "C"
                technique_instance = models.TechniqueInstance(researcher=request.user.researcheruser,
                                                        technique=technique,
                                                        level=level,
                                                        evaluat_date=datetime.date.today())
                technique_instance.save()
                print(technique_instance)
                return HttpResponseRedirect(reverse("researcher:technique"))
            elif method == 'certificant':
                level = "B"
            else:
                level = "A"
            resume = request.FILES['resume']
            technique_instance = models.TechniqueInstance(researcher=request.user.researcheruser,
                                                        technique=technique,
                                                        level=level,
                                                        resume=resume)
            technique_instance.save()
            return HttpResponseRedirect(reverse("researcher:technique"))
        print(form.errors['technique'])
        return render(request ,self.template_name ,{"technique_error" :form.errors['technique']})

class Question(generic.TemplateView):
    template_name = 'researcher/question.html'

    def get(self, request, *args, **kwargs):
        if (not request.user.is_authenticated) or (not models.ResearcherUser.objects.filter(user=request.user).count()):
            return HttpResponseRedirect(reverse('chamran:login'))
        try:
           researcher = models.ResearcherUser.objects.get(user=request.user)
        except models.ResearcherUser.DoesNotExist:
            raise Http404('.کاربر پژوهشگر مربوطه یافت نشد')
        if researcher.status.status == 'not_answered':
            if researcher.researchquestioninstance_set.all().count():
                question = self.request.user.researcheruser.researchquestioninstance_set.all().reverse()[0]
                return HttpResponseRedirect(reverse('researcher:question-show' ,kwargs={'question_id' : question.research_question.uniqe_id}))
            return super().get(self, request, *args, **kwargs)
        else:
            raise Http404('شما به سوال ارزیابی پاسخ داده اید.')
        return super().get(self, request, *args, **kwargs)
        
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.user.researcheruser.researchquestioninstance_set.all().count() > 0:
            context['question_instance'] = "True"
            context['uuid'] = self.request.user.researcheruser.researchquestioninstance_set.all().reverse()[0].research_question.uniqe_id
        return context

    def post(self, request, *args, **kwargs):
        question_list = ResearchQuestion.objects.filter(is_answered=False)
        print(len(question_list))
        if len(question_list) == 0:
            return HttpResponseRedirect(reverse('researcher:index'))
        print(random.randint(1 ,len(question_list)))
        question = question_list[random.randint(1 ,len(question_list))-1]
        question_instance = models.ResearchQuestionInstance(research_question=question,
                                                            researcher = request.user.researcheruser)
        question_instance.save()
        return HttpResponseRedirect(reverse('researcher:question-show' ,kwargs={"question_id" :question.uniqe_id}))

class QuestionShow(generic.TemplateView ):
    template_name = 'researcher/layouts/preview_question.html'

    def get(self ,request ,*args, **kwargs):
        if (not request.user.is_authenticated) or (not models.ResearcherUser.objects.filter(user=request.user).count()):
            return HttpResponseRedirect(reverse('chamran:login'))
        if kwargs['question_id'] != request.user.researcheruser.researchquestioninstance_set.all().reverse()[0].research_question.uniqe_id:
            raise Http404("سوال مورد نظر پیدا نشد.")
        question = request.user.researcheruser.researchquestioninstance_set.all().reverse()[0]        
        deltatime = datetime.date.today() - question.hand_out_date
        if deltatime.days < 8:
            if question.is_answered:
                print("+_+_+_+_+_+_+_+_+_+_====")
                pass #show its in waiting for evaliator answer
            if question.is_correct :
                request.user.researcheruser.status.status = 'free'
                request.user.researcheruser.status.status.save()
                #show massage that u have answered
        else:
            status = request.user.researcheruser.status
            status.status = 'inactivated'
            inactivate_date = datetime.date.today()+ datetime.timedelta(days=30)
            status.inactivate_duration = inactivate_date
            status.save()
        return super().get(request ,args, kwargs)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        question = models.ResearchQuestionInstance.objects.filter(researcher=self.request.user.researcheruser).reverse()[0]
        deltatime = datetime.date.today() - question.hand_out_date
        if deltatime.days < 8:
            context['rest_days'] = 8 - deltatime.days
        context['question_title'] = question.research_question.question_title
        context['question'] = question.research_question.question
        context['attach_file'] = question.research_question.attach_file
        context['hour'] = 23 - datetime.datetime.now().hour
        context['minute'] = 59 - datetime.datetime.now().minute
        context['second'] = 59 - datetime.datetime.now().second
        return context
    
    def post(self ,request ,*args, **kwargs):
        question = self.request.user.researcheruser.researchquestioninstance_set.all().reverse()[0]
        uuid_id = question.research_question.uniqe_id
        if 'answer' in request.FILES:
            question.answer = request.FILES['answer']
            print(question.answer)
            question.is_answered = True
            question.save()
            subject = 'Research Question Validation'
            message ="""با عرض سلام و خسته نباشید.
            پژوهشگر {} به نام {} {} به سوال پژوهشی {} پاسخ داده است.
            لطفا پاسخ پژوهشگر را ارزیابی نمایید.
            با تشکر""".format(self.request.user.username ,self.request.user.researcheruser.researcherprofile.first_name,
                            self.request.user.researcheruser.researcherprofile.last_name,
                            question.research_question.question_title)
            email = question.research_question.expert.user.username
            try:
                send_mail(
                    subject=subject,
                    message=message, 
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[email],
                )
            except TimeoutError:
                return HttpResponse('Timeout Error!!')
        return HttpResponseRedirect(reverse("researcher:question-show" ,kwargs={"question_id" :uuid_id}))
    
def ajax_Technique_review(request):
    print(request.POST)
    print(request.FILES)
    discription = request.POST['request_body']
    method = request.POST['request_confirmation_method']

    if discription is not None and method is not None:
        if method != "exam":
            resume = request.FILES['resume']
            if resume is None:
                data = {
                        'resume' : "حتما باید فایلی آپلود کنید.",
                    }
                return JsonResponse(data ,status=400)
            technique_review = models.TechniqueReview(technique = blah,discription=discription,
                                                      method=method ,resume=resume)
        else:
            technique_review = models.TechniqueReview(technique = blah,discription=discription,
                                                      method=method)
        technique_review.save()
        data = {'success' : 'successful'}
        return JsonResponse(data)


TECHNIQUES = {
    'Polymerase Chain Reaction' :'Molecular Biology',
    'RNA-Seq' :'Molecular Biology',
    'DNA Metylation Analysis' :'Molecular Biology',
    'DNA Gel Electorphoresis' :'Molecular Biology',
    'Two-Dimensional Gel Electorphoresis' :'Molecular Biology',
    'Gel Purification' :'Molecular Biology',
    'DNA Ligation Reaction' :'Molecular Biology',
    'Restriction Enzyme Digests' :'Molecular Biology',
    'Bacterial Culture' :'Molecular Biology',
    'Bacterial Transformation The Heat Shock Method' :'Molecular Biology',
    'Bacterial Transformation Electroporation' :'Molecular Biology',
    'Plasmid Purification' :'Molecular Biology',
    'The Western Bolt' :'Molecular Biology',
    'The Northern Bolt' :'Molecular Biology',
    'Co-Immunoprecipition and Pull-Down Assays' :'Molecular Biology',
    'Expression Profiling with Microarrays' :'Molecular Biology',
    'Cytogenetics' :'Molecular Biology',
    'Chromatin Immunoprecipition' :'Molecular Biology',
    'Recombineering and Gene Targeting' :'Molecular Biology',
    'SNP Genotyping' :'Molecular Biology',
    'Genome Editing' :'Molecular Biology',
    'Gene Silencing' :'Molecular Biology',

    'The ELISA Method' :'Immunology',
    'Flow Cytometry' :'Immunology',
    'Flow cell storing' :'Immunology',
    'Magnetice Bead cell Isolation' :'Immunology',

    'SEM Imaging of Biological Samples' :'Imaging',
    'Biodistribution of Nano-drog Carriers Applications of SEM' :'Imaging',
    'Imaging of Biological Samples with Optical and Confocal Microscopy' :'Imaging',
    'Calcium Imaging in Neurons' :'Imaging',
    'Animal Flourescene' :'Imaging',
    'Animal CT' :'Imaging',
    'Animal MRI' :'Imaging',
    'Animal SPECT' :'Imaging',
    'Animal PET' :'Imaging',
    'Animal US' :'Imaging',

    'Sterile Tissue Harvest' :'Histology',
    'Diagnostic Necropsy and Tissue Harvest' :'Histology',
    'Tissue Cryopreservation' :'Histology',
    'Tissue Fixation' :'Histology',
    'Microtome Sectioning' :'Histology',
    'Cryostat Sectioning' :'Histology',
    'H&E staining' :'Histology',
    'Histochemistry' :'Histology',
    'Histoflouresence' :'Histology',

    'An Introduction to the Centrifuge' :'General Lab',
    'Regulating Temperature in the Lab Preserving Samples Using Cold' :'General Lab',
    'Introduction to the Bunsen Burner' :'General Lab',
    'Introduction to Serological Pipettes and Pipettor' :'General Lab',
    'An Introduction to the Micropipettor' :'General Lab',
    'Making Solutions in the Laboratory' :'General Lab',    
    'Understanding Concentration and Measuring Volumes' :'General Lab',
    'Introduction to the Microplate Reader' :'General Lab',
    'Regulation Temperature in the Lab Applying Heat' :'General Lab',
    'Common Lab Glassware and Users' :'General Lab',
    'Solutions and Concentrations' :'General Lab',
    'Determining the Density of a Solid and Liquid' :'General Lab',
    'Determining the Mass Percent Composition in an Aqueous Solution' :'General Lab',
    'Determining the Empirical Formula' :'General Lab',
    'Determining the Solubility Rules of Ionic Compounds' :'General Lab',
    'Using a pH Meter' :'General Lab',
    'Introduction to Titration' :'General Lab',
    'Ideal Gas Law' :'General Lab',

    'An Introduction to Working in Hood' :'Lab Safety',
    'Operation of High-pressure Reactor Vessels' :'Lab Safety',
    'Decontamination for laboratory Biosafety Proper Waste Disposal' :'Lab Safety',
    'Fume Hoods and Laminar Flow Cabinates' :'Lab Safety',
    'Handling Chemical Spills' :'Lab Safety',
    'Chemical Storage Categories,Hazards and Compatibilies' :'Lab Safety',
    'Guidelines in Case of an Laboratory Emergency' :'Lab Safety',
    'Work with Hot and Cold Sources' :'Lab Safety',
    'Electrical Safety' :'Lab Safety',
    'Emergency Eyewash and Shower Stations' :'Lab Safety',
    'Proper Personal Protective Equipment' :'Lab Safety',

    'Serearching on articles resources' :'Research Methodology',
    'Endnote' :'Research Methodology',
    'spss/graph pad' :'Research Methodology',
    'Essy writing' :'Research Methodology',
    'Poster Presentation' :'Research Methodology',
    'Microsoft Office' :'Research Methodology',
    'Photoshop' :'Research Methodology',

    'Introduction to the Spectrophotometer' :'Biochemistry',
    'Measuring Mass in the Laboratory' :'Biochemistry',
    'NMR' :'Biochemistry',
    'X-ray Fluorescence(XRF)' :'Biochemistry',
    'Gas Chromatography(GC) with Flame-lonization Detection' :'Biochemistry',
    'High-Performance Liquid Chromatography(HPLC)' :'Biochemistry',
    'Ion-Exchange Chromatography' :'Biochemistry',
    'Chromatography-based Biomolecule Purification Methods' :'Biochemistry',
    'Capillary Electrophoresis(CE)' :'Biochemistry',
    'Introduce to Mass Spectrometry' :'Biochemistry',
    'Scanning Electron Microscopy(SEM)' :'Biochemistry',
    'Cyclic Voltammetry(CV)' :'Biochemistry',
    'MALDI-TOF Mass Spectrometry' :'Biochemistry',
    'Tandem Mass Spectrometry' :'Biochemistry',
    'Protein Crystallization' :'Biochemistry',
    'Electrophoretic Mobility Shift Assay(EMSA)' :'Biochemistry',
    'Photometric Protein Determination' :'Biochemistry',
    'Density Gradient Ultracentrifugation' :'Biochemistry',
    'Forster Resonance Energy Transfer(FRET)' :'Biochemistry',
    'Surface Plasmon Resonance(SPR)' :'Biochemistry',
    'Synthetic Organic Chemestry' :'Biochemistry',

    'An Introduction to the Laboratory Mouse Mos Musculus' :'Animal Lab',
    'Rodent Handling and Restraint Techniques' :'Animal Lab',
    'Basic Mouse Care and Maintenance' :'Animal Lab',
    'Development and Reproduction of the Laboratory Mouse' :'Animal Lab',
    'Basic Care Procedures' :'Animal Lab',
    'Fundamentals of Breeding and Weaning' :'Animal Lab',
    'Rodent Identification I' :'Animal Lab',
    'Rodent Identification II' :'Animal Lab',
    'Compound Administration I' :'Animal Lab',
    'Compound Administration II' :'Animal Lab',
    'Compound Administration III' :'Animal Lab',
    'Compound Administration IV' :'Animal Lab',
    'Blood Withdrawal I' :'Animal Lab',
    'Anesthesia Introduction and Maintenance' :'Animal Lab',
    'Rodent Stereoxtic Surgery' :'Animal Lab',
    'Considerations for Rodent Surgery' :'Animal Lab',

    'Whole-Mount in Situ Hybridization' :'Cellular Biology',
    'Molecular Cloning' :'Cellular Biology',
    'Yeast Transformation and Cloning' :'Cellular Biology',
    'Embryonic Steam Cell Culture and Differentiaton' :'Cellular Biology',
    'An Introduction to Transfection' :'Cellular Biology',
    'Transduction' :'Cellular Biology',
    'Introduction to Light Microscopy' :'Cellular Biology',
    'Introduction to Fluorescence Microscopy' :'Cellular Biology',
    'Histological Sample Preparation for Light Microscopy' :'Cellular Biology',
    'Cell-surface Biotinylation Assay' :'Cellular Biology',
}

# 7072488c-02ab-4362-9e51-7100dae78473
#persiontools
function load_dialog() {
    $(".title-back").each(function () {
        var title_back_width = $(this).prev().outerWidth() + 30;
        $(this).css("width", title_back_width);
    });
    $(".row-header > .header").each(function () {
        var divWidth = $(this).outerWidth();
        divWidth = $(this).closest("div").innerWidth() - divWidth;
        $(this).prev().css("width", divWidth / 2 - 10);
        $(this).next().css("width", divWidth / 2 - 10);
        $(this).css("left", (divWidth) / 2);
    });
}

function init_windowSize() {
    if ($(window).width() < 575.98) {
    } else {
        var contentWidth = $(document).innerWidth() - 250;
        var contentMargin = 0.0862 * contentWidth - 54.9655;
        $(".info-card").css({
            "margin-right": contentMargin,
            "margin-left": contentMargin
        });
        $(".content").css({
            "width": contentWidth,
            "height": "90%"
        });
        $(".side-bar").css("height", "100%");
    }
}

function loading() {
    $(".main").addClass("blur-div");
    var canvas = $("#loading-canvas");
    canvas.drawArc({
        strokeStyle: '#000',
        strokeWidth: 4,
        rounded: true,
        endArrow: true,
        arrowRadius: 15,
        arrowAngle: 90,
        x: 160, y: 120,
        start: 90,
        end: 360,
        radius: 50
    });
}

function blur_div_toggle(content) {
    if ($(content).hasClass("blur-div")) {
        $(content).removeClass("blur-div");
    } else {
        $(content).addClass("blur-div");
    }
}

function init_dialog_btn(element, dialogClass) {
    $(element).click(function () {
        $(".fixed-back").css("display", "none");
        $(".main").removeClass("blur-div");
        blur_div_toggle(".main");
        $(dialogClass).css("display", "block");
        close_dialog(dialogClass);
        dialog_comment_init();
        load_dialog();
        // $(".project-info-innerDiv").height($(".project-info-content").outerHeight());
        if (dialogClass === ".showProject") {
            accept_project();
            $(dialogClass).removeAttr("id");
            $(dialogClass).attr("id", $(this).attr("id"));
        } else if (dialogClass === ".select-technique") {
            $(dialogClass).find("form").attr("id", $(element).closest(".fixed-back").attr("id"));
        }
    });
}

function input_focus() {
    if ($("input[type='text'],input[type='email'],textarea").prop("disabled")) {
        $(this).each(function () {
            var inputLabel = "label[for='" + $(this).attr("id") + "']";
            $(inputLabel).addClass("full-focus-out");
            $(inputLabel).css({
                "font-size": "13px",
                "top": "12px",
                "right": "30px",
                "color": "#8d8d8d"
            });

        });
    }
    $("input[type='text'],input[type='email'],textarea").each(function () {
        var inputLabel = "label[for='" + $(this).attr("id") + "']";
        if ($(this).val() !== '') {
            $(inputLabel).addClass("full-focus-out");
            $(inputLabel).css({
                "font-size": "12px",
                "top": "12px",
                "right": "30px",
                "color": "#6f7285",
                "padding": "0 10px"
            });
        }
        if ($(this).hasClass("error")) {
            $(inputLabel).css("color", "#ff4545");
        }
    }).on("focus", function () {
        var inputLabel = "label[for='" + $(this).attr("id") + "']";
        if ($(this).hasClass("solid-label")) {
            return false;
        } else if ($(this).hasClass("error")) {
            var errorDiv = $(this).next(".error");
            $(this).on("change", function () {
                if ($(this).hasClass("error")) {
                    $(this).removeClass("error");
                    $(errorDiv).remove();
                }
            });
        } else {
            $(inputLabel).addClass("full-focus-out");
            $(inputLabel).css({
                "font-size": "12px",
                "top": "12px",
                "right": "30px",
                "color": "#3CCD1C",
                "padding": "0 10px"
            });
            $(this).css("color", "#3ccd1c");
        }
    }).on("focusout", function () {
        var inputLabel = "label[for='" + $(this).attr("id") + "']";
        if ($(this).hasClass("solid-label")) {
            return false;
        } else if ($(this).hasClass("error")) {

        } else {
            $(inputLabel).css("color", "#6f7285");
            if ($(this).val() === '') {
                $(inputLabel).css({
                    "font-size": "13px",
                    "top": "28px",
                    "right": "25px",
                    "color": "#6f7285",
                    "padding": "0"
                });
                $(inputLabel).removeClass("full-focus-out");
            } else {
                $(this).css("color", "#8d8d8d");
                $(inputLabel).css("color", "#8d8d8d");
            }
        }
    });
}

function cancel_add(className) {
    div = "<span class='initial-value' style='border: 1px dashed #bdbdbd;width: fit-content;border-radius: 0.25em;padding: 5px 10px;font-size: 13px;font-weight: 300;'>برای افزودن سابقه جدید روی <i class='fas fa-plus'></i>  کلیک کنید!  </span>";
    $(".reject-btn").click(function () {
        if ($(className).html() === '') {
            $(className).append(div);
        }
    });
}

function accept_project() {
    $(".accept-btn").click(function () {
        $(".showProject").slideUp('slow').delay('slow');
        $(".project-details").delay('slow').slideDown('slow');
        close_dialog(".project-details");
        $('.add-researcher').hover(function () {
            $(this).addClass("hover");
        }, function () {
            $(this).removeClass("hover");
        });
        vote_dialog_init();
        load_dialog();
    });
}

function search_input(className) {
    $(className).focusin(function () {
        $(this).css("width", "50%");
    }).focusout(function () {
        if ($(this).val() === '') {
            $(this).css("width", "initial");
        }
    });
}

function close_dialog(className) {
    $(".close").click(function () {
        if($(className).closest(".fixed-back").hasClass("show-question")){
            $(className).find(".all-answers").html("");
            $(className).find(".question-attach").html('<ul class="inline-list">' +
                '<li class="list-item">' +
                '<a href="#" class="attach-file" dideo-checked="true">' +
                '<span class="attachment"></span>' +
                '<span class="attach-name">ضمیمه ای وجود ندارد</span>' +
                '</a>' +
                '</li>' +
                '</ul>');
        }
        $(className).css("display", "none");
        $(".main").removeClass("blur-div");
    });
}

function record_edit(className) {
    $(className + " .fa-pen").click(function () {
        if ($(className + " .ch-card-item").length === 0) {
            if (className === '.education') {
                var count = parseInt($(this).attr('id').replace('edit_edu_', ''));
                $(className).append(education_data_form(count));
                cancel_add(".education");
                $("#edu-section" + count).val($(this).closest('tr').children("td:nth-child(1)").text());
                $("#edu-subject" + count).val($(this).closest('tr').children("td:nth-child(2)").text());
                $("#university" + count).val($(this).closest('tr').children("td:nth-child(3)").text());
                $("#edu-city" + count).val($(this).closest('tr').children("td:nth-child(4)").text());
                $("#edu-year" + count).val($(this).closest('tr').children("td:nth-child(5)").text());
            } else if (className === '.executive') {
                var count = parseInt($(this).attr('id').replace('edit_exe_', ''));
                $(className).append(executive_data_form(count));
                cancel_add(".executive");
                $("#duty" + count).val($(this).closest('tr').children("td:nth-child(1)").text());
                $("#from" + count).val($(this).closest('tr').children("td:nth-child(2)").text());
                $("#until" + count).val($(this).closest('tr').children("td:nth-child(3)").text());
                $("#workplace" + count).val($(this).closest('tr').children("td:nth-child(4)").text());
                $("#exe-city" + count).vaal($(this).closest('tr').children("td:nth-child(5)").text());
            } else if (className === '.research') {
                var count = parseInt($(this).attr('id').replace('edit_stu_', ''));
                $(className).append(research_data_form(count));
                cancel_add(".research");
                $("#subject" + count).val($(this).closest('tr').children("td:nth-child(1)").text());
                $("#admin" + count).val($(this).closest('tr').children("td:nth-child(2)").text());
                $("#liable" + count).val($(this).closest('tr').children("td:nth-child(3)").text());
                $("#rank" + count).val($(this).closest('tr').children("td:nth-child(4)").text());
            } else if (className === '.paper') {
                var count = parseInt($(this).attr('id').replace('edit_art_', ''));
                $(className).append(paper_data_form(count));
                cancel_add(".paper");
                $("#paper-name" + art_count).val($(this).closest('tr').children("td:nth-child(1)").text());
                $("#publish-date" + art_count).val($(this).closest('tr').children("td:nth-child(2)").text());
                $("#published-at" + art_count).val($(this).closest('tr').children("td:nth-child(3)").text());
                $("#impact-factor" + art_count).val($(this).closest('tr').children("td:nth-child(4)").text());
                $("#referring-num" + art_count).val($(this).closest('tr').children("td:nth-child(5)").text());
            }
            input_focus();
        }
    });
    $(className + " .fa-trash-alt").click(function () {
        div = "<span class='initial-value' style='border: 1px dashed #bdbdbd;width: fit-content;border-radius: 0.25em;padding: 5px 10px;font-size: 13px;font-weight: 300;'>برای افزودن سابقه جدید روی <i class='fas fa-plus'></i>  کلیک کنید!  </span>";
        if (className === '.education') {
            var count = parseInt($(this).attr('id').replace('edit_edu_', ''));
            $(this).closest("tr").remove();
        } else if (className === '.executive') {
            var count = parseInt($(this).attr('id').replace('edit_exe_', ''));
            $(this).closest("tr").remove();
        } else if (className === '.research') {
            var count = parseInt($(this).attr('id').replace('edit_stu_', ''));
            $(this).closest("tr").remove();
        } else if (className === '.paper') {
            var count = parseInt($(this).attr('id').replace('edit_art_', ''));
            $(this).closest("tr").remove();
        }
        if ($(className + " > table > tbody > tr").length === 0) {
            $(className).html(div);
        }
    });
}

function education_data_form(edu_count) {
    div = document.createElement("div");
    $(div).addClass('card').addClass('ch-card-item');
    $(div).attr("id", edu_count);
    $(div).html("<div class='row'>" +
        "<div class='col-lg-6'>" +
        "<label for=\"edu-section" + edu_count + "\">مقطع تحصیلی</label>\n" +
        "<input type=\"text\" name='degree' id=\"edu-section" + edu_count + "\" class=\"w-100\">" +
        "</div>" +
        "<div class='col-lg-6'>" +
        "<label for=\"edu-subject" + edu_count + "\">رشته تحصیلی</label>\n" +
        "<input type=\"text\" name='degree' id=\"edu-subject" + edu_count + "\" class=\"w-100\">" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<div class='row'>" +
        "<div class='col-lg-5'>" +
        "<label for=\"university" + edu_count + "\">دانشگاه</label>\n" +
        "<input type=\"text\" name='degree' id=\"university" + edu_count + "\" class=\"w-100\">" +
        "</div>" +
        "<div class='col-lg-4'>" +
        "<label for=\"edu-city" + edu_count + "\">شهر محل تحصیل</label>\n" +
        "<input type=\"text\" name='degree' id=\"edu-city" + edu_count + "\" class=\"w-100\">" +
        "</div>" +
        "<div class='col-lg-3'>" +
        "<label for=\"edu-year" + edu_count + "\">سال اخذ مدرک</label>\n" +
        "<input type=\"text\" name='degree' id=\"edu-year" + edu_count + "\" class=\"w-100\">" +
        "</div>" +
        "</div>" +
        "<div class='row mtop-lg-25'>" +
        "<div class='col-lg-9'>" +
        "<input type='submit' id='" + edu_count + "' class='w-100 accept-btn btn' value='افزودن'>" +
        "</div>" +
        "<div class='col-lg-3'>" +
        "<button type='button' id='" + edu_count + "' class='w-100 refuse-btn btn'>لغو</button>" +
        "</div>" +
        "</div>");
    // console.log(expert);
    console.log(instance);
    // console.log(scientific_form);
    // console.log(some_text);
    return div;
}


function show_scientific_record() {
    row = "<tr>" +
        "<td>" + $("#edu-section").val() + "</td>" +
        "<td>" + $("#edu-subject").val() + "</td>" +
        "<td>" + $("#university").val() + "</td>" +
        "<td>" + $("#edu-city").val() + "</td>" +
        "<td>" + $("#edu-year").val() + "</td>" +
        "<td>" +
        "<i class='fas fa-pen' id='edit_edu'></i>" +
        "<i class='fas fa-trash-alt' id='delete_edu'></i>" +
        "</td>" +
        "</tr>";

    if (!$(".education > table").hasClass("table")) {
        table = "<table class='table mtop-lg-25'>" +
            "<thead>" +
            "<tr>" +
            "<td>مقطع تحصیلی</td>" +
            "<td>رشته تحصیلی</td>" +
            "<td>دانشگاه</td>" +
            "<td>شهر محل تحصیل</td>" +
            "<td>سال اخذ مدرک</td>" +
            "<td></td>" +
            "</tr>" +
            "</thead>" +
            "<tbody>" +
            "</tbody>" +
            "</table>";
        $(".education").html(table);
    }
    $(".education > table > tbody").append(row);
    $(".education div#" + $(this).attr("id")).remove();
    record_edit(".education");
}

function executive_data_form(exe_count) {
    div = document.createElement("div");
    $(div).addClass('card').addClass('ch-card-item');
    $(div).attr("id", exe_count);
    $(div).html("<form action='' method='post'><div class='row'>" +
        "<div class='col-lg-5'>" +
        "<label for='duty" + exe_count + "'>سمت</label>" +
        "<input type='text' id='duty" + exe_count + "' class='w-100'>" +
        "</div>" +
        "<div class='col-lg-1'>" +
        "<span class='center-vr'>زمان :</span>" +
        "</div>" +
        "<div class='col-lg-3'>" +
        "<label for='from" + exe_count + "'>از تاریخ</label>" +
        "<input type='text' id='from" + exe_count + "' class='w-100'>" +
        "</div>" +
        "<div class='col-lg-3'>" +
        "<label for='until" + exe_count + "'>تا تاریخ</label>" +
        "<input type='text' id='until" + exe_count + "' class='w-100'>" +
        "</div>" +
        "</div>" +
        "<div class='row'>" +
        "<div class='col-lg-5'>" +
        "<label for='workplace" + exe_count + "'>محل خدمت</label>" +
        "<input type='text' id='workplace" + exe_count + "' class='w-100'>" +
        "</div>" +
        "<div class='col-lg-4'>" +
        "<label for='exe-city" + exe_count + "'>شهر</label>" +
        "<input type='text' id='exe-city" + exe_count + "' class='w-100'>" +
        "</div>" +
        "<div class='col-lg-3'></div>" +
        "</div>" +
        "<div class='row mtop-lg-25'>" +
        "<div class='col-lg-9'>" +
        "<button type='button' id='" + exe_count + "' class='w-100 accept-btn btn'>افزودن</button>" +
        "</div>" +
        "<div class='col-lg-3'>" +
        "<button type='button' id='" + exe_count + "' class='w-100 refuse-btn btn'>لغو</button>" +
        "</div>" +
        "</div></form>");
    return div;
}

function executive_record() {
    $(".executive-btn > i.fa-plus").click(function () {
        if ($(".executive .ch-card-item").length === 0) {
            if ($(".executive > .initial-value").hasClass("initial-value")) {
                $(".executive").html(executive_data_form(exe_count));
            } else {
                $('.executive').append(executive_data_form(exe_count));
            }
            cancel_add(".executive");
            add_executive_record(exe_count);
            input_focus();
            $("#from" + exe_count).persianDatepicker({});
            $("#until" + exe_count).persianDatepicker({});
            exe_count++;
        }
    });
}

function show_executive_record() {
    row = "<tr>" +
        "<td>" + $("#duty").val() + "</td>" +
        "<td>" + $("#from").val() + "</td>" +
        "<td>" + $("#until").val() + "</td>" +
        "<td>" + $("#workplace").val() + "</td>" +
        "<td>" + $("#exe-city").val() + "</td>" +
        "<td>" +
        "<i class='fas fa-pen' id='edit_exe'></i>" +
        "<i class='fas fa-trash-alt' id='delete_exe'></i>" +
        "</td>" +
        "</tr>";
    if (!$(".executive > table").hasClass("table")) {
        table = "<table class='table mtop-lg-25'>" +
            "<thead>" +
            "<tr>" +
            "<td>سمت</td>" +
            "<td>محل خدمت</td>" +
            "<td>شهر</td>" +
            "<td>از تاریخ</td>" +
            "<td>تا تاریخ</td>" +
            "<td></td>" +
            "</tr>" +
            "</thead>" +
            "<tbody>" +
            "</tbody>" +
            "</table>";
        $(".executive").html(table);
    }
    $(".executive > table > tbody").append(row);
    $(".executive div#" + $(this).attr("id")).remove();
    record_edit(".executive");
}

function research_data_form(stu_count) {
    div = document.createElement("div");
    $(div).addClass('card').addClass('ch-card-item');
    $(div).attr("id", stu_count);
    $(div).html("<form action='' method='post'><div class='row'>" +
        "<div class='col-lg-5'>" +
        "<label for='subject" + stu_count + "'>عنوان طرح پژوهشی</label>" +
        "<input type='text' id='subject" + stu_count + "' class='w-100'>" +
        "</div>" +
        "<div class='col-lg-3'>" +
        "<label for='admin" + stu_count + "'>نام مجری</label>" +
        "<input type='text' id='admin" + stu_count + "' class='w-100'>" +
        "</div>" +
        "<div class='col-lg-4'>" +
        "<label for='liable" + stu_count + "'>مسئول اجرا/همکار</label>" +
        "<input type='text' id='liable" + stu_count + "' class='w-100'>" +
        "</div>" +
        "</div>" +
        "<div class='row'>" +
        "<div class='col-lg-7 rankDiv'>" +
        "<label class='rankLabel' for='rank' style='width:245px'>وضعیت طرح پژوهشی</label>" +
        "<select id='rank'>" +
        "<option selected dir='rtl'>انتخاب کنید ...</option>" +
        "<option value='1'>در دست  اجرا</option>" +
        "<option value='2'>خاتمه یافته</option>" +
        "<option value='3'>متوقف</option>" +
        "</select>" +
        "</div>" +
        "<div class='col-lg-5'></div>" +
        "</div>" +
        "<div class='row mtop-lg-25'>" +
        "<div class='col-lg-9'>" +
        "<button type='button' id='" + stu_count + "' class='w-100 accept-btn btn'>افزودن</button>" +
        "</div>" +
        "<div class='col-lg-3'>" +
        "<button type='button' id='" + stu_count + "' class='w-100 refuse-btn btn'>لغو</button>" +
        "</div>" +
        "</div></form>");
    return div;
}

function research_record() {
    $(".research-btn > i.fa-plus").click(function () {
        if ($(".research .ch-card-item").length === 0) {
            if ($(".research > .initial-value").hasClass("initial-value")) {
                $(".research").html(research_data_form(stu_count));
            } else {
                $('.research').append(research_data_form(stu_count));
            }
            cancel_add(".research");
            add_research_record(stu_count);
            input_focus();
            stu_count++;
        }
    });
}

function show_research_record() {
    row = "<tr>" +
        "<td>" + $("#subject").val() + "</td>" +
        "<td>" + $("#admin").val() + "</td>" +
        "<td>" + $("#liable").val() + "</td>" +
        "<td>" + $("#rank").val() + "</td>" +
        "<td>" +
        "<i class='fas fa-pen' id='edit_stu'></i>" +
        "<i class='fas fa-trash-alt' id='edit_stu'></i>" +
        "</td>" +
        "</tr>";
    if (!$(".research > table").hasClass("table")) {
        table = "<table class='table mtop-lg-25'>" +
            "<thead>" +
            "<tr>" +
            "<td>عنوان طرح پژوهشی</td>" +
            "<td>مجری</td>" +
            "<td>مسئول اجرا/ همکار</td>" +
            "<td>وضعیت طرح پژوهشی</td>" +
            "<td></td>" +
            "</tr>" +
            "</thead>" +
            "<tbody>" +
            "</tbody>" +
            "</table>";
        $(".research").html(table);
    }
    $(".research > table > tbody").append(row);
    $(".research div#" + $(this).attr("id")).remove();
    record_edit(".research");
}

function paper_data_form(art_count) {
    div = document.createElement("div");
    $(div).addClass('card').addClass('ch-card-item');
    $(div).attr("id", art_count);
    $(div).html("<form action='' method='post'><div class='row'>" +
        "<div class='col-lg-4'>" +
        "<label for='paper-name" + art_count + "'>عنوان مقاله</label>" +
        "<input type='text' id='paper-name" + art_count + "' class='w-100'>" +
        "</div>" +
        "<div class='col-lg-4'>" +
        "<label for='publish-date" + art_count + "'>تاریخ انتشار</label>" +
        "<input type='text' id='publish-date" + art_count + "' class='w-100'>" +
        "</div>" +
        "<div class='col-lg-4'>" +
        "<label for='published-at" + art_count + "'>محل دقیق انتشار</label>" +
        "<input type='text' id='published-at" + art_count + "' class='w-100'>" +
        "</div>" +
        "</div>" +
        "<div class='row'>" +
        "<div class='col-lg-5'>" +
        "<label for='impact-factor" + art_count + "'>Impact Factor</label>" +
        "<input type='text' id='impact-factor" + art_count + "' class='w-100'>" +
        "</div>" +
        "<div class='col-lg-4'>" +
        "<label for='referring-num" + art_count + "'>تعداد ارجاع به مقاله شما</label>" +
        "<input type='text' id='referring-num" + art_count + "' class='w-100'>" +
        "</div>" +
        "<div class='col-lg-3'></div>" +
        "</div>" +
        "<div class='row mtop-lg-25'>" +
        "<div class='col-lg-9'>" +
        "<button type='button' id='" + art_count + "' class='w-100 accept-btn btn'>افزودن</button>" +
        "</div>" +
        "<div class='col-lg-3'>" +
        "<button type='button' id='" + art_count + "' class='w-100 refuse-btn btn'>لغو</button>" +
        "</div>" +
        "</div></form>");
    return div;
}

function paper_record() {
    $(".paper-btn > i.fa-plus").click(function () {
        if ($(".paper .ch-card-item").length === 0) {
            if ($(".paper > .initial-value").hasClass("initial-value")) {
                $(".paper").html(paper_data_form(art_count));
            } else {
                $('.paper').append(paper_data_form(art_count));
            }
            cancel_add(".paper");
            add_paper_record(art_count);
            input_focus();
            art_count++;
        }
    });
}

function show_paper_record() {
    row = "<tr>" +
        "<td>" + $("#paper-name").val() + "</td>" +
        "<td>" + $("#publish-date").val() + "</td>" +
        "<td>" + $("#published-at").val() + "</td>" +
        "<td>" + $("#impact-factor").val() + "</td>" +
        "<td>" + $("#referring-num").val() + "</td>" +
        "<td>" +
        "<i class='fas fa-pen' id='edit_art'></i>" +
        "<i class='fas fa-trash-alt' id='edit_art'></i>" +
        "</td>" +
        "</tr>";
    if (!$(".paper > table").hasClass("table")) {
        table = "<table class='table mtop-lg-25'>" +
            "<thead>" +
            "<tr>" +
            "<td>عنوان مقاله</td>" +
            "<td>تاریخ انتشار</td>" +
            "<td>محل دقیق انتشار</td>" +
            "<td>Impact Factor</td>" +
            "<td>تعداد ارجاع</td>" +
            "<td></td>" +
            "</tr>" +
            "</thead>" +
            "<tbody>" +
            "</tbody>" +
            "</table>";
        $(".paper").html(table);
    }
    $(".paper > table > tbody").append(row);
    $(".paper div#" + $(this).attr("id")).remove();
    record_edit(".paper");
}

function show_new_research_question() {
    new_question = '<div class="card check-question flow-root-display">' +
        '<div class="question-title w-50">' + $("#question-title").val() + '</div>' +
        '<div class="question-info w-50">' +
        '<div class="date w-25\"><span>الان</span></div>' +
        '<div class="answers w-25"><i class="far fa-comments fa-lg"><span class="num"></span></i></div>' +
        '<div class="status w-25"><span>درحال بررسی</span></div>' +
        '<div class="show w-25"><button class="default-btn show-btn">مشاهده</button></div>' +
        '</div>' +
        '</div>';
    $(".tab-content").html(new_question);
}

function dialog_comment_init() {
    // add emoji to comment
    $(".new-comment-tools > .fa-smile").click(function () {
        alert("Not working");
        // $('#comment').emojiPicker('toggle');
        // alert("a");
    });
    // delete user comment
    $(".comment-tools > .fa-trash-alt").click(function () {
        $(this).parents("div.my-comment").remove();
    });
    // attach file to comment
    $(".new-comment-tools > label[for='comment-attach']").click(function () {
        rows = $("textarea#comment").attr("rows");
        $("textarea#comment").attr("rows", ++rows);
        padding_bottom = parseInt($("textarea#comment").css("padding-bottom")) + 30;
        $("textarea#comment").css("padding-bottom", padding_bottom);

        if ($("div.attachment > div").last().hasClass("attach")) {
            bottom_position = parseInt($("div.attachment > div").last().css("bottom"));
        } else {
            bottom_position = 10;
        }

        // $("div.attachment").append("<div class='attach'>" +
        //     "<span>" + "نام فایل" + "</span>" +
        //     "<div class='progress'>" +
        //     "<div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='75' aria-valuemin='0' aria-valuemax='100' style='width: 75%'></div>" +
        //     "</div>" +
        //     "</div>");
        // $("div.attachment > div").last().css("bottom", bottom_position + 30);
    });
    // replay to a comment
    $(".comment-tools > .fa-reply").click(function () {
        var text = $.trim($(this).closest("div").children(2).text());
        $("textarea#comment").closest("div").append("<div class='replay-div'></div>");
        $(".replay-div").html("<i class='fa fa-reply fa-lg'></i>" + text + "<i class='fa fa-times'></i>");
        $(".replay-div > .fa-times").click(function () {
            $(".replay-div").remove();
            $("textarea#comment").css("padding-top", "2px").focus().on("focusout", function () {
                var inputLabel = "label[for='" + $(this).attr("id") + "']";
                $(inputLabel).css("color", "#6f7285");
                if ($(this).val() === '') {
                    $(inputLabel).css({
                        "font-size": "14px",
                        "top": "28px",
                        "right": "25px",
                        "color": "#6f7285"
                    });
                } else {
                    $(this).css("color", "#8d8d8d");
                    $(inputLabel).css("color", "#8d8d8d");
                }
            });
        });
        $("textarea#comment").css("padding-top", "35px").focus().on("focusout", function () {
            var inputLabel = "label[for='" + $(this).attr("id") + "']";
            $(inputLabel).css("color", "#6f7285");
            if ($(this).val() === '') {
                $(inputLabel).css({
                    "font-size": "14px",
                    "top": "58px",
                    "right": "25px",
                    "color": "#6f7285"
                });
            } else {
                $(this).css("color", "#8d8d8d");
                $(inputLabel).css("color", "#8d8d8d");
            }
        });
    });
    // edit user comment
    $(".comment-tools > .fa-pen").click(function () {
        text = $.trim($(this).closest("div").children(2).text());
        $("textarea#comment").html(text);
        $("textarea#comment").focus();
    });
}

function vote_slider_industry(slide_count) {
    industry_counter = 0;
    $(".industry-voting .next-button").click(function () {
        alert("industry_counter = " + industry_counter);
        if (industry_counter < slide_count - 1) {
            industry_counter++;
            progressWidth = parseInt($(".industry-voting .vote-list > .vote-item").css('width'));
            width = parseFloat($(".industry-voting .progress-line").css('width'));
            $(".industry-voting .progress-line").css('width', width + progressWidth);
            $(".industry-voting .swiper-wrapper").css({
                "transform": "translate3d(-" + 100 * industry_counter + "%, 0, 0)",
                "transition-duration": "0.3s"
            });
        }
        if (industry_counter === slide_count - 1) {
            $(this).html("<i class='fas fa-check'></i>" +
                "ثبت");
        }
        if (industry_counter > 0) {
            $(".industry-voting .prev-button").removeClass("disabled");
        }
    });
    $(".industry-voting .prev-button").click(function () {
        alert("industry_counter = " + industry_counter);
        if (industry_counter > 0) {
            industry_counter--;
            progressWidth = parseInt($(".industry-voting .vote-list > .vote-item").css('width'));
            width = parseFloat($(".industry-voting .progress-line").css('width'));
            $(".industry-voting .progress-line").css('width', width - progressWidth);
            $(".industry-voting .swiper-wrapper").css({
                "transform": "translate3d(-" + 100 * industry_counter + "%, 0, 0)",
                "transition-duration": "0.3s"
            });
        }
        if (industry_counter === slide_count - 2) {
            $(".industry-voting .next-button").html("<i class='fas fa-arrow-right'></i>" +
                "بعدی");
        }
        if (industry_counter === 0) {
            $(this).addClass('disabled');
        }
    });
}

function vote_slider_researcher(slide_count) {
    researcher_counter = 0;
    $(".researcher-voting .next-button").click(function () {
        alert("researcher_counter = " + researcher_counter);
        if (researcher_counter < slide_count - 1) {
            researcher_counter++;
            progressWidth = parseInt($(".researcher-voting .vote-list > .vote-item").css('width'));
            width = parseFloat($(".researcher-voting .progress-line").css('width'));
            $(".researcher-voting .progress-line").css('width', width + progressWidth);
            $(".researcher-voting .swiper-wrapper").css({
                "transform": "translate3d(-" + 100 * researcher_counter + "%, 0, 0)",
                "transition-duration": "0.3s"
            });
        }
        if (researcher_counter === slide_count - 1) {
            $(this).html("<i class='fas fa-check'></i>" +
                "ثبت");
        }
        if (researcher_counter > 0) {
            $(".researcher-voting .prev-button").removeClass("disabled");
        }
    });
    $(".researcher-voting .prev-button").click(function () {
        alert("researcher_counter = " + researcher_counter);
        if (researcher_counter > 0) {
            researcher_counter--;
            progressWidth = parseInt($(".researcher-voting .vote-list > .vote-item").css('width'));
            width = parseFloat($(".researcher-voting .progress-line").css('width'));
            $(".researcher-voting .progress-line").css('width', width - progressWidth);
            $(".researcher-voting .swiper-wrapper").css({
                "transform": "translate3d(-" + 100 * researcher_counter + "%, 0, 0)",
                "transition-duration": "0.3s"
            });
        }
        if (researcher_counter === slide_count - 2) {
            $(".researcher-voting .next-button").html("<i class='fas fa-arrow-right'></i>" +
                "بعدی");
        }
        if (researcher_counter === 0) {
            $(this).addClass('disabled');
        }
    });
}

function vote_dialog_init() {
    flag = 0;
    $(".vote-question").hover(function () {
        $(this).parent('.col-lg-12').children('.vote-question-text').slideDown().css({
            "color": "#3ccd1c",
            "border-color": "#3ccd1c"
        });
    }, function () {
        if (!$(this).parent('.col-lg-12').children('.vote-question-text').hasClass('fix')) {
            $(this).parent('.col-lg-12').children('.vote-question-text').slideUp();
        } else {
            $(this).parent('.col-lg-12').children('.vote-question-text').css({
                "color": "#707070",
                "border-color": "#707070"
            })
        }
    }).click(function () {
        $(this).parent('.col-lg-12').children('.vote-question-text').toggleClass('fix');
    });
    $(".vote").click(function () {
        if ($('.vote-dialog').css('display') === 'none') {
            $('.vote-dialog').slideDown();
            $('.vote > .dots').addClass('expand');
        } else {
            $('.vote-dialog').slideUp();
            $('.vote > .dots').removeClass('expand');
        }
    });
    $(".vote-dialog > .industry-back").hover(function () {
        $(this).addClass('hover');
    }, function () {
        $(this).removeClass('hover');
    }).click(function () {
        $(".project-details").slideUp('slow').delay('slow');
        $(".industry-voting").delay('slow').slideDown('slow');
        close_dialog('.industry-voting');
        vote_slider_industry(12);
        $(".progress-line").css("width", "calc(100% / 12)");
    });
    $(".vote-dialog > .researcher-back").hover(function () {
        $(this).addClass('hover');
    }, function () {
        $(this).removeClass('hover');
    }).click(function () {
        $(".project-details").slideUp('slow').delay('slow');
        $(".researcher-voting").delay('delay').slideDown('slow');
        close_dialog('.researcher-voting');
        vote_slider_researcher(10);
        $(".progress-line").css("width", "calc(100% / 10)");
    });
}

function question_page_init() {

}

function question_dialog_init() {
    $(".answer").hover(function () {
        if (!$(this).find('button').hasClass('answered')) {
            $(this).find('.correct button').fadeIn('slow');
            $(this).find(".wrong button").fadeIn('slow');
        }
    }, function () {
        if (!$(this).find('button').hasClass('answered')) {
            $(this).find('.correct button').fadeOut('slow');
            $(this).find(".wrong button").fadeOut('slow');
        }
    });
    $(".answer .check .correct button").click(function () {
        set_answer_true($(this));

        let id = $(this).attr("id");
        $.ajax({
            method: 'GET',
            url: '/expert/set_answer_situation/',
            dataType: 'json',
            data: {id: id, type:true},
            success: function (data) {},
            error: function (data) {},
        });
    });
    $(".answer .check .wrong button").click(function () {
        set_answer_wrong($(this));

        let id = $(this).attr("id");
        $.ajax({
            method: 'GET',
            url: '/expert/set_answer_situation/',
            dataType: 'json',
            data: {id: id, type:false},
            success: function (data) {},
            error: function (data) {},
        });
    });


    $(".question-attach input[type='file']").on('change', function () {
        var fileType = $(this).val().split('.').pop().toLowerCase();
        var fileName = $(this).val().split('\\').pop();
        $(this).closest(".list-item").find(".attach-btn label span:last-child").html(fileName);
        $(this).closest(".list-item").find(".attach-btn label span.attach-icon").removeClass("attach-icon").addClass(fileType + "-file");
        // attach_li = "<li class='list-item'>" +
        //     "<a href='#' class='attach-file'>" +
        //     "<span class='" + fileType + "-file'></span>" +
        //     "<span dir='ltr'>" + fileName + "</span>" +
        //     "</a>" +
        //     "</li>";
        // $(this).closest('ul.inline-list').append(attach_li);
    });
}

function set_answer_wrong(item) {
    var div = "<span>پاسخ نادرست</span><i class='fas fa-times'></i>";
    item.closest('.check').find('.correct').css('display', 'none');
    item.closest('.check').find('.wrong').css('display', 'none');
    item.closest('.check').find('button').addClass('answered');
    item.closest('.check').find('.status').addClass('wrong-answer');
    item.closest('.check').children('.status').append(div);
    item.closest('.check').find('.status').fadeIn('slow');
}

function set_answer_true(item) {
    var div = "<span>پاسخ صحیح</span><i class='fas fa-check'></i>";
    item.closest('.check').find('.correct').css('display', 'none');
    item.closest('.check').find('.wrong').css('display', 'none');
    item.closest('.check').find('button').addClass('answered');
    item.closest('.check').find('.status').addClass('correct-answer');
    item.closest('.check').children('.status').append(div);
    item.closest('.check').find('.status').fadeIn('slow');
}

function show_question_answers(data) {
    var answer = '';
    for (i = 0; i < data.length; i++) {
        answer = answer + '<div class="col-lg-12">' +
            '<div class="answer" is-correct="'+ data[i].is_correct +'">' +
            '<span class="title">' + data[i].researcher_name + '</span>' +
            '<span class="date">' + data[i].hand_out_date + '</span>' +
            '<div><a href="' + data[i].answer_attachment + '">File Link</a></div>' +
            '<div class="check">' +
            '<div class="correct">' +
            '<button type="button" title="صحیح" id="' + data[i].answer_id +'">' +
            '<i class="fas fa-check"></i>' +
            '</button>' +
            '</div>' +
            '<div class="wrong">' +
            '<button type="button" title="نادرست" id="' + data[i].answer_id +'">' +
            '<i class="fas fa-times"></i>' +
            '</button>' +
            '</div>' +
            '<div class="status"></div>' +
            '</div>' +
            '</div>' +
            '</div>';
    }
    $(".all-answers").html(answer);
    $(".answer").each(function () {
        let is_correct = $(this).attr("is-correct");
        if (is_correct==='correct') {
            set_answer_true($(this).find(".check").find(".correct").find("button"))
        } else if (is_correct==='wrong') {
            set_answer_wrong($(this).find(".check").find(".correct").find("button"))
        }
    })
}
function select_technique() {
    $("li[role='treeitem']").click(function () {
        let tree = $("#fancy-tree").fancytree({
            activate: function (event, data) {
                node = data.node;
                $('#tags').addTag(node.title);
            }
        });
    });
    $("#add-new-technique").keyup(function (e) {
       if(e.keyCode === 13) {
           if($(this).val() !== "") {
               $('#tags').addTag($(this).val());
               $(this).val("");
           }
       }
    });
}

function tag_input_label(tag_input) {
    $("#" + tag_input + "_tagsinput .tags_clear").css("display", "none");
    $("#" + tag_input + "_tagsinput span.tag a").html("<i class='fas fa-times'></i>");

    if (!$(".tagsinput").find(".tag").length) {
        $("label[for='" + tag_input + "']").removeClass("full-focus-out").css({
            "font-size": "13px",
            "top": "28px",
            "right": "25px",
            "color": "#6f7285",
            "padding": "0"
        });
        $("#" + tag_input + "_tag").attr("placeholder", "");
    }

    $("#" + tag_input + "_tag").on("focus", function () {
        $("label[for='" + tag_input + "']").addClass("full-focus-out").css({
            "font-size": "12px",
            "top": "12px",
            "right": "30px",
            "padding": "0 10px",
            "color": "#3ccd1c"
        });
        $(".tagsinput").css("border-color", "#3ccd1c");
    }).on("focusout", function () {

        $(".tagsinput").css("border-color", "#bdbdbd85");

        if ($(".tagsinput").find(".tag").length) {
            $("label[for='" + tag_input + "']").addClass("full-focus-out").css({
                "font-size": "12px",
                "top": "12px",
                "right": "30px",
                "padding": "0 10px",
                "color": "#6f7285"
            });
        } else {
            $("label[for='" + tag_input + "']").removeClass("full-focus-out").css({
                "font-size": "13px",
                "top": "28px",
                "right": "25px",
                "color": "#6f7285",
                "padding": "0"
            });
            $("#" + tag_input + "_tag").attr("placeholder", "");
        }
    });
}

function newItem_label() {
    $("#tags_tagsinput").find("#tags_tag").attr("placeholder", "افزودن");
    tag_input_label("tags");
}
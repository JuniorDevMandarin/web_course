/** add_minicoders **/
function add_new_minicoder(event, max_forms){
    if(event){
        event.preventDefault();
    }
    const totalForms = document.getElementById('id_form-TOTAL_FORMS');
    if(totalForms.value<max_forms){
        properFormId = findProperId();
        const newEmptyForm = document.getElementById('empty-form').cloneNode(true);
        newEmptyForm.setAttribute('class','minicoder-form-name form-input');
        newEmptyForm.setAttribute("style","border: none");
        newEmptyForm.setAttribute('id',`form-${properFormId}`);
        newEmptyForm.setAttribute('value', "");
        const regex = new RegExp('__prefix__', 'g');
        newEmptyForm.innerHTML = newEmptyForm.innerHTML.replace(regex, properFormId);

        const formCopy = document.getElementById('new-minicoders-form');
        const newCurrentForms = formCopy.children.length + 1;

        const closeFormChild = document.createElement("span");
        closeFormChild.setAttribute('class','icon-delete fs-4');

        const closeChildImage = document.createElement("i");
        closeChildImage.setAttribute('class','fa fa-times');
        
        closeFormChild.append(closeChildImage)
        closeFormChild.addEventListener('click', function deleteChild(){
            const currentForms = document.getElementById('new-minicoders-form');
            const newCurrentForms = currentForms.children.length - 1;
            const totalForms = document.getElementById('id_form-TOTAL_FORMS');
            totalForms.setAttribute('value', newCurrentForms);
            closeFormChild.parentElement.remove();
        });

        newEmptyForm.append(closeFormChild);
        totalForms.setAttribute('value', newCurrentForms);
        formCopy.append(newEmptyForm);
    } 

}
function findProperId(){
    allIds = getAllFormIds();
    newId= 1;
    while(allIds.includes(newId)){
        newId = newId+1;
    }
    return newId;

}
function getAllFormIds() {
    allForms = document.getElementById('new-minicoders-form');
    allIds = [];
    for (var p = 0; p <= allForms.children.length - 1; p++) {
        if(p>0){
            formId=allForms.children[p].id.charAt(5);
            allIds.push(parseInt(formId));
        }
    }
    return allIds;
}

function validateMinicodersAndSelectPlan(location) { 

    allForms = document.getElementById('new-minicoders-form');
    for (var p = 0; p <= allForms.children.length - 1; p++) {
        allForms.children[p].setAttribute("style","border: none");
        nameInput = allForms.children[p].children[1];
        if(nameInput.value == ""){
            allForms.children[p].setAttribute("style","border: 1px solid red");
            document.getElementById('minicodersFormMain').scrollIntoView();
            return false;
        }
    }

    const promo_code = document.getElementById('id_promo_code');
    const new_input_promo = document.createElement("input");
    new_input_promo.setAttribute('type','hidden');
    new_input_promo.setAttribute('name', `${promo_code.getAttribute("name")}`);
    new_input_promo.setAttribute('value',`${promo_code.value}`);
    new_input_promo.setAttribute('id', `${promo_code.id}`);

    const location_from = document.createElement("input");
    location_from.setAttribute('type','hidden');
    location_from.setAttribute('name', 'location_from');
    location_from.setAttribute('value',`${location}`);

    const form_element = document.getElementById("minicoders_form");
    updateMinicodersForm()
    form_element.appendChild(new_input_promo);
    form_element.appendChild(location_from);
    form_element.submit();

}

function updateMinicodersForm() { 
    const totalForms = document.getElementById('id_form-TOTAL_FORMS');
    if(totalForms.value == 0){
        const addOne = parseInt(totalForms.value)+1;
        totalForms.setAttribute('value', addOne);
    }
    orderForm();

}

function orderForm(){
    allForms = document.getElementById('new-minicoders-form');
    ordered = false;
    number = 1;
    while(!ordered){
        if(number>7){
            ordered=true;
        }
        if(allForms.children['form-'+number]!=undefined){
            allForms.append(allForms.children['form-'+number]);
        }
        number = number + 1;
    }
}

/** minicoder_plans  **/
function changeSelectPlan(plan_id) {
    const low_plan = document.getElementById("low_plan").classList.remove('selected-plan');;
    const normal_plan = document.getElementById("normal_plan").classList.remove('selected-plan');
    const high_plan = document.getElementById("high_plan").classList.remove('selected-plan');
    const plan_selected = document.getElementById(plan_id).classList.add('selected-plan');
    if(plan_id === "low_plan"){
        document.getElementById("plan_price").setAttribute("value", "low_plan")
    }
    else if(plan_id === "normal_plan"){
        document.getElementById("plan_price").setAttribute("value", "normal_plan")
    }
    else if(plan_id === "high_plan"){
        document.getElementById("plan_price").setAttribute("value", "high_plan")
    }
}

// function changeSubscriptionPlanType() {
//     const form_new_plan = document.getElementById("form_change_subscription_plan");
//     const plan_selected = document.getElementById("formCustomSelectPlan");
//     const form_input = document.getElementById("newSubscriptionPlan");
//     form_input.value = plan_selected.value;
//     form_new_plan.submit();
// }

function paySubscription() {
    const form_element = document.getElementById("subscription_form");
    form_element.submit();
}

function changePlansLayout(id) {
    var element = document.getElementsByClassName('button-plan active')[0];
    element.classList.remove('active');

    document.getElementById(id).classList.add('active');

    if(id == 'individualPlan'){
        document.getElementById('individualPlans').style.display = 'flex';
        document.getElementById('familyPlans').style.display = 'none';
    }else{
        document.getElementById('individualPlans').style.display = 'none';
        document.getElementById('familyPlans').style.display = 'flex';
    }
}


/** others **/
function recoverPassword() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('psswdRecoverForm').style.display = 'flex';
}

$(document).on('submit', '#post-recover-password',function(e){
    e.preventDefault();
    var email = $('#recovery_email').val()
    $.ajax({
        type:'GET',
        url:'/api/users/password_recovery?email=' + email,
        data:{
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            action: 'get'
        },
        success:function(json){
            document.getElementById("post-recover-password").reset();
            $("#alert-success").show();
        },
        error : function(xhr,errmsg,err) {
            $("#alert-fail").show();
        }
    });
});

$(document).on('submit', '#post-new-password',function(e){
    e.preventDefault();
    $("#alert-success").hide();
    $("#alert-fail").hide();
    $.ajax({
        type:'POST',
        url:'/api/users/password_recovery',
        data:{
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            token: $('#recovery_token').val(),
            password: $('#recovery_password').val(),
            email: $('#recovery_email').val(),
            csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val(),
            action: 'post'
        },
        success:function(json){
            $("#alert-success").show();
        },
        error : function(xhr,errmsg,err) {
            $("#alert-fail").empty().append(xhr.responseJSON.detail).show();
        }
    });
});
  
<SCRIPT LANGUAGE="JavaScript">
function verify() {
var themessage = "Please fill out the following fields: \r";
if (document.form.FirstName.value=="") {
themessage = themessage + " -First Name \r";
}

if (document.form.LastName.value=="") {
themessage = themessage + " -Last Name \r";
}
if (document.form.Email.value=="") {
themessage = themessage + " -Email \r";
}
if (document.form.fieldX.value=="") {
themessage = themessage + " -Math Question \r";
}




//alert if fields are empty and cancel form submit
if (themessage == "Please fill out the following fields: \r") {
document.form.submit();
}
else {
alert(themessage);
return false;
   }
}
//  End -->
</script>
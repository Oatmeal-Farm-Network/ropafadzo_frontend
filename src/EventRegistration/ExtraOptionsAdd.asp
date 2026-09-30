<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<%@ Language=VBScript %>

<HTML>
<HEAD>
<title>Extra Options Options</title>
<!--#Include file="AdminEventGlobalVariables.asp"-->
</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include virtual="Header.asp"--> 
<!--#Include virtual="ExtraOptionsHeader.asp"--> 




<% 
sql = "select * from Services, ServicetypeLookup where Services.ServiceTypeLookupID = ServicetypeLookup.ServiceTypeLookupID and ServicetypeLookup.ServiceType = 'ExtraOptions' and EventID =  " & EventID & " Order by ServicesID Desc"
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	FeePerAnimal = rs("Price")
	FeePerPen  =  rs("Price2")
	MaxQTY2 =  rs("ServiceMaxQuantity")
	if len(MaxQTY2) > 0 then
	  MaxQTY = "checked"
	end if

	MaxDate =  rs("MaxDate")
	if MaxDate = "True" then
	  StopDate = "checked"
	end if
	Description =  rs("Description")


str1 = Description
str2 = "</br>"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1, str2 , vbCrLf)
	
End If  


str1 = Description
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, " ")
End If 

str1 = Description
str2 = "''"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, "'")
End If 

	
End If 

%>


<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>



<SCRIPT LANGUAGE="JavaScript">
function verify() {
var themessage = "Please fill out the following fields: \r";
if (document.AddForm.ExtraOptionsName.value=="") {
themessage = themessage + " - Extra Options Title \r";
}
if (document.AddForm.ExtraOptionsPrice.value=="") {
themessage = themessage + " - Extra Options Price \r";
}


//alert if fields are empty and cancel form submit
if (themessage == "Please fill out the following fields: \r") {
document.AddForm.submit();
}
else {
alert(themessage);
return false;
   }
}
//  End -->
</script>




<% 

 EventID = request.querystring("EventID") 
 sql = "select * from ExtraOptions where EventID = " & EventID & ""
'response.write(sql)

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
if not rs.eof then

'publish= rs("publish")
ExtraOptionsID = rs("ExtraOptionsID")
ExtraOptionsPrice= rs("ExtraOptionsPrice")
AvaliableWithSponsorships= rs("AvaliableWithSponsorships")
AvaliableByItself= rs("AvaliableByItself")


str1 = ExtraOptionsName
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	ExtraOptionsName= Replace(str1,  str2, " ")
End If 

str1 = ExtraOptionsName
str2 = "''"
If InStr(str1,str2) > 0 Then
	ExtraOptionsName= Replace(str1,  str2, "'")
End If 

end if 
%>

<a name="Top"></a>

<% PageTitleText = "Add an Extra Show Option"  %>
<!--#Include file="970Top.asp"-->
<form name = "AddForm" action= "ExtraOptionsAddHandleForm.asp?EventID=<%=EventID%>" method = "post">
<input name="Action"  size = "60" value = "Add" type = "hidden">
<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >

    <tr><td class = "body2"  >
    <% Message= request.querystring("Message")
if len(Message)> 2 then %>   
<font color = "red">Your Extra Options option have been added. To edit advertsing options please select <a href = "ExtraOptionsHome.asp?EventID=<%=EventID%>" class = "body">Edit Extra Show Options</a></font><br>

<% end if %>


 * = required field<br></td></tr>
</table>


<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
 <tr>
  	<td class = "body2" align = "right" >Title: *</td>
  	<td class = "body2" ><input name="ExtraOptionsName"  size = "85" ></td>
  </tr>
 <tr >
 <tr>
  	<td class = "body2" align = "right">Price (Value):*</td>
  	<td class = "body2">$<input class="positive" type="text" name = "ExtraOptionsPrice" size = 7 maxsize = 9 >
  	
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
</tr>
 <tr>
  	<td class = "body2" align = "right">QTY Available:</td>
  	<td class = "body2" ><input class="positive" type="text" name = "ExtraOptionsQTYAvailable" size = 7 maxsize = 9 >
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
<tr>
	  <td class = "body2" align = "right">Avaliable With Sponsorships?:</td>
  		<td class = "body2" >
  		
		Yes<input TYPE="RADIO" name="AvaliableWithSponsorships" Value = "Yes" checked>
		No<input TYPE="RADIO" name="AvaliableWithSponsorships" Value = "No" >

		</td>
	</tr>
	<tr>
	  <td class = "body2" align = "right">Avaliable for Purchase By Itself?:</td>
  		<td class = "body2" >
  		
		Yes<input TYPE="RADIO" name="AvaliableByItself" Value = "Yes" checked>
		No<input TYPE="RADIO" name="AvaliableByItself" Value = "No" >
	
		</td>
	</tr>
	<tr>
<td class = "body2" valign = "top" align = "right">Extra Option Description:</td>
<td class = "body2">
  <%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>  

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>


<script language="javascript1.2">
// attach the editor to the textarea with the identifier 'textarea1'.
WYSIWYG.attach("ExtraOptionsID");
</script> 

 
<TEXTAREA NAME="ExtraOptionsDescription" cols="58" rows="18" wrap="file" id="ExtraOptionsID" ><%= ExtraOptionsDescription %></textarea>
  
</td>
</tr>
<tr>
  <td class = "body2" colspan = "2" align = "center">
  <input type=submit value="Add an Extra Option"  class = "regsubmit2" >
</td>
</tr>
 </table>
</form>

<br>

<!--#Include file="970Bottom.asp"-->
<br>

<!--#Include virtual="Footer.asp"--> 
</Body>
</HTML>

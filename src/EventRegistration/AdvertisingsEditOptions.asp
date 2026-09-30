<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<%@ Language=VBScript %>

<HTML>
<HEAD>
<title>Vendor Facts</title>
<link rel="stylesheet" type="text/css" href="style.css">
</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include virtual="globalVariables.asp"--> 
<!--#Include virtual="Header.asp"--> 
<!--#Include virtual="AdvertisingHeader.asp"--> 




<% 
sql = "select * from Services, ServicetypeLookup where Services.ServiceTypeLookupID = ServicetypeLookup.ServiceTypeLookupID and ServicetypeLookup.ServiceType = 'Advertising' and EventID =  " & EventID & " Order by ServicesID Desc"
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
if (document.AddForm.AdvertisingStallName.value=="") {
themessage = themessage + " - Advertising Stall Title \r";
}
if (document.AddForm.AdvertsingStallPrice.value=="") {
themessage = themessage + " - Advertising Stall Price \r";
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
 sql = "select * from AdvertisingLevels where EventID = " & EventID & ""
'response.write(sql)

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
if not rs.eof then

'publish= rs("publish")
AdvertisingLevelID = rs("AdvertisingLevelID")
AdvertisingLevelPrice= rs("AdvertisingLevelPrice")


str1 = AdvertisingLevelName
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	AdvertisingLevelName= Replace(str1,  str2, " ")
End If 

str1 = AdvertisingLevelName
str2 = "''"
If InStr(str1,str2) > 0 Then
	AdvertisingLevelName= Replace(str1,  str2, "'")
End If 

end if 
%>

<a name="Top"></a>
<form name = "AddForm" action= 'AdvertisingOptionsAddHandleForm.asp' method = "post">
<input name="Action"  size = "60" value = "Add" type = "hidden">
<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
 <tr>
 <td class = "body2" colspan = "2"><big><b>Add an Advertising Option</b></big></td>
 </tr>
  <tr><td class = "body2"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
    <tr><td class = "body2"  >
    <% Message= request.querystring("Message")
if len(Message)> 2 then %>   
<font color = "red">Your advertising option have been added. To edit advertsing options please select <a href = "AdvertisingsEditOptions.asp?EventID=<%=EventID%>" class = "body">Edit Advertising Options</a></font><br>

<% end if %>


 * = required field<br></td></tr>
</table>


<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
 <tr>
  	<td class = "body2" align = "right" >Title: *</td>
  	<td class = "body2" ><input name="AdvertisingLevelName"  size = "45" ></td>
  </tr>
 <tr >
 <tr>
  	<td class = "body2" align = "right">Price:*</td>
  	<td class = "body2"><small>$</small><input class="positive" type="text" name = "AdvertisingLevelPrice" size = 7 maxsize = 9 >
  	
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
</tr>
 <tr>
  	<td class = "body2" align = "right">QTY Available:</td>
  	<td class = "body2" ><input class="positive" type="text" name = "AdvertisingLevelQTYAvailable" size = 7 maxsize = 9 >
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
<tr>
  	<td class = "body2" align = "right">Advertisement Dimensions:</td>
  	<td class = "body2" ><input class="positive" type="text" name = "AdvertisingDimensions" size = 15 maxsize = 20 >
	</td>
</tr>
<tr>
  <td class = "body2" colspan = "2" align = "center">
  <input type=submit value="Add Advertising Option"  class = "regsubmit2" >
</td>
</tr>
 </table>
</form>






<%
row = "odd"
rowcount = 1
 sql = "select * from AdvertisingLevels  where EventID = " & EventID

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 
    if  rs.eof then %>
    <table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
<tr>
 <td class = "body2" colspan = "2"><big><b><a name = "Edit"></a>Edit Advertising Options</b></big></td>
 </tr>
  <tr><td class = "body2"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
    <tr><td class = "body2"  >No vendor options have been added yet. To add vendor options please use the form above.</td></tr>
</table>


<% end if 
  
 %>


<br><br><br>
<div align = "center"><a href = "#Top" class ="body">Click here to go to the top of the page.</a></center>

<!--#Include virtual="Footer.asp"--> 
</Body>
</HTML>

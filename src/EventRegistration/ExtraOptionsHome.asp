<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Extra Options</title>
<meta http-equiv="Content-Language" content="en-us">
</head>
<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>

<% Current = "admin" %>
<!--#Include file="AdminEventsHeader.asp"-->
<% Current = "Extra Options" %>
<!--#Include file="OverviewHeader.asp"-->
<!--#Include file="Scripts.asp"-->

    	<a href = "ExtraOptionsHome.asp?EventID=<%=eventID%>" class = "menu2">Extra Options Overview (Edit Extra options)</a> |
 	 	<a href = "ExtraOptionsAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Extra Options</a>&nbsp; 

<a name= "ExtraOptions">
<% PageTitleText = "Extra Options Overview"  %>
<!--#Include file="970Top.asp"-->
  
 
<%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>   
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>




<br>
<table border = "0" bordercolor = "#DBF5F3" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "900" align = "center" >
<tr>
 <td class = "body2" colspan  "2"><big><b>Edit Extra Options</b></big><br>
</td>
 </tr>
 <tr><td class = "body2" colspan  "3" bgcolor = "#abacab" height = "1"></td></tr>
<tr><td class = "body2" colspan  "3" height = "1">
		<% 
	EventID = request.querystring("EventID")
  	'response.write("EventID = " & EventID & "<br>")
  	sql = "select * from ExtraOptions where not (OptionType = 'Halter') and not (OptionType = 'Dinner') and not (OptionType = 'Vendor')  and not (OptionType = 'Advertising')  and not (OptionType = 'Sponsorship')  and EventID = " & EventID & " Order by ExtraOptionsName" 
	'response.write(sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if rs.eof then 
%>
Currently you do not have any Extra Options listed. To add ExtraOptions please select  <a href = "ExtraOptionsAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Extra Options</a>.
		
<% else %>

Below are a list of the Extra Options that are listed for your event:
<% end if %>		
		
		</td></tr>
</table>



<% Message = "" %>
<%Message = request.querystring("Message")%>
<%if len(Message) > 1 then %>
	<table border = "0" bordercolor = "#DBF5F3" cellpadding=0 cellspacing=0 width = "900" align = "center" >
	<tr>
	 <td class = "body2" ><font color = "red"><%=Message%></font>
	 </td>
	 </tr>
	</table>
<% end if %>

<% 
	EventID = request.querystring("EventID")
  	'response.write("EventID = " & EventID & "<br>")
  	sql = "select * from ExtraOptions where not (OptionType = 'Halter') and not (OptionType = 'Dinner') and not (OptionType = 'Vendor')  and not (OptionType = 'Advertising') and not (OptionType = 'Sponsorship')  and EventID = " & EventID & "" 
	'response.write(sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then 
		ExtraOptionsID = rs("ExtraOptionsID")
		ExtraOptionsName = rs("ExtraOptionsName")
		ExtraOptionsDescription = rs("ExtraOptionsDescription")
		ExtraOptionsQTYAvailable= rs("ExtraOptionsQTYAvailable")
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
<SCRIPT LANGUAGE="JavaScript"  type="text/javascript">
function verify() {
var themessage = "Please fill out the following fields: \r";
if (document.AddForm.ExtraOptionsName.value=="") {
themessage = themessage + " - Class Title \r";
}
if (document.AddForm.AvaliableByItself.value=="") {
themessage = themessage + " - Class Price \r";
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

<a name="Edit">
<% 
	row = "odd"
	rowcount = 1
 	sql = "select * from ExtraOptions  where not (OptionType = 'Halter') and not (OptionType = 'Dinner') and not (OptionType = 'Vendor')  and not (OptionType = 'Advertising') and not (OptionType = 'Sponsorship')  and EventID = " & EventID
	'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 
%>

	<table border = "0" bordercolor = "#DBF5F3"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
	<form action= 'ExtraOptionsEditHandleForm.asp#Edit' method = "post">
	<input name="Action"  size = "60" value = "Update" type = "hidden">
	<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">
<% 	
	rowcount = 1  
	if not rs.eof then %>
	
	<br>
	<table border = "0" cellpadding=0 cellspacing=0 width = "900" align = "center">
	  <tr bgcolor = "#DBF5F3">
	  <td class="body2" align = "center" width= "200">
	      <b>Title</b>
     </td>
     <td class="body2" align = "center" width = "150">
	       <b>Price (Value)</b>
	 </td>
	 <td class="body2" align = "center" width = "80">
	       <b>QTY Available (Total)</b>
	 </td>
 	 <td class="body2" align = "center" width = "80">
	       <b>Available with Sponsorships?</b>
	 </td>
	 <td class="body2" align = "center" width = "80">
	       <b>Available by Itself?</b>
	 </td>
	 <td class="body2" align = "center">
	       <b>Actions</b>
	  </td>
	</tr>
	<tr><td class = "body2" colspan= "6" bgcolor = "#abacab" height = "1"></td></tr>

	
	
   <% end if 
	
	
	While Not rs.eof %>
	
	
	<%	ExtraOptionsName = rs("ExtraOptionsName")
		ExtraOptionsPrice = rs("ExtraOptionsPrice")
		ExtraOptionsQTYAvailable = rs("ExtraOptionsQTYAvailable")
		ExtraOptionsDescription = rs("ExtraOptionsDescription")
		AvaliableWithSponsorships = rs("AvaliableWithSponsorships")
		AvaliableByItself = rs("AvaliableByItself")
		ExtraOptionsID = rs("ExtraOptionsID")
		
		
		
	%>
		<% if order = "even" then 
	order = "odd"
		%>
	  <tr bgcolor = "#DBF5F3">
	<% else 
	   order = "even"%>
		<tr>
	<% end if %>
	     <td class="body2">
	       <a href = "ExtraOptionsEditDetails.asp?ExtraOptionsID=<%=ExtraOptionsID%>&ExtraOptionsName=<%=ExtraOptionsName%>&EventID=<%=EventID%>"><%=ExtraOptionsName %></a>
	     </td>
	     <td class="body2" >
	        <a href = "ExtraOptionsEditDetails.asp?ExtraOptionsID=<%=ExtraOptionsID%>&ExtraOptionsName=<%=ExtraOptionsName%>&EventID=<%=EventID%>"><%=ExtraOptionsPrice %></a>
	     </td>
	     <td class="body2" >
 			 <a href = "ExtraOptionsEditDetails.asp?ExtraOptionsID=<%=ExtraOptionsID%>&ExtraOptionsName=<%=ExtraOptionsName%>&EventID=<%=EventID%>"><%=ExtraOptionsQTYAvailable %></a>
	     </td>
	      <td class="body2" >
	      	 <a href = "ExtraOptionsEditDetails.asp?ExtraOptionsID=<%=ExtraOptionsID%>&ExtraOptionsName=<%=ExtraOptionsName%>&EventID=<%=EventID%>"><%=AvaliableWithSponsorships %></a>
	     </td>
	     <td class="body2" >
	      	 <a href = "ExtraOptionsEditDetails.asp?ExtraOptionsID=<%=ExtraOptionsID%>&ExtraOptionsName=<%=ExtraOptionsName%>&EventID=<%=EventID%>"><%=AvaliableByItself %></a>
	     </td>

     	<td class="body2" align = "center">
	      <a href = "ExtraOptionsEditDetails.asp?ExtraOptionsID=<%=ExtraOptionsID%>&ExtraOptionsName=<%=ExtraOptionsName%>&EventID=<%=EventID%>"><img src = "images/Edit.gif" width = "15" border = "0" alt = "Edit Extra Option"></a>&nbsp;&nbsp;&nbsp; 
	      <a href = "ExtraOptionsDeleteHandleForm.asp?ExtraOptionsID=<%=ExtraOptionsID%>&EventID=<%=EventID%>"><img src = "images/delete.jpg" width = "15" border = "0" alt = "Delete Extra Option"></a>&nbsp;&nbsp;&nbsp;

	     </td>
	   </tr>
  
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
</table>

</form>
<% end if %>

<!--#Include file="970Bottom.asp"-->
 
<!--#Include virtual="Footer.asp"--> 

</Body>
</HTML>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<%@ Language=VBScript %>

<HTML>
<HEAD>
<title>Sponsorship Options</title>
<link rel="stylesheet" type="text/css" href="style.css">
</head>
<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>
<% EventId = request.querystring("EventID") %> 
<!--#Include file="AdminEventGlobalVariables.asp"-->
<% Current = "admin" %>
<!--#Include file="AdminEventsHeader.asp"-->




<!--#Include file="SponsorHeader.asp"--> 


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
 <td class = "body2" colspan  "2"><big><b>Edit Sponsorship Options</b></big><br>
</td>
 </tr>
 <tr><td class = "body2" colspan  "3" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<tr><td class = "body2" colspan  "3" height = "1">
		<% 
	EventID = request.querystring("EventID")

  sql = "select * from  SponsorshipLevels  where SponsorshipLevels.EventID = " & EventID
	'response.write(sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	rs.Open sql, conn, 3, 3   
	if not rs.eof then 
%>
		Below are a list of the Sponsorship Options for your event:
<% else
%>
Currently there are no sponsorship options listed. To add sponsorship options please select <a href ="SponsorshipAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Sponsorship Options</a>.<br>


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

<SCRIPT LANGUAGE="JavaScript"  type="text/javascript">
function verify() {
var themessage = "Please fill out the following fields: \r";
if (document.AddForm.SponsorshipLevelName.value=="") {
themessage = themessage + " - Class Title \r";
}
if (document.AddForm.SponsorshipLevelN.value=="") {
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
 	sql = "select * from SponsorshipLevels  where EventID = " & EventID
	'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then 
%>

	<table border = "0" bordercolor = "#DBF5F3"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
	<form action= 'ClassesEditHandleForm.asp#Edit' method = "post">
	<input name="Action"  size = "60" value = "Update" type = "hidden">
	<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">
<% 	
	rowcount = 1  
	if not rs.eof then %>
	
	<br>
	<table border = "0" cellpadding=0 cellspacing=0 width = "900" align = "center">
	  <tr bgcolor = "#DBF5F3">
	  <td class="body2" align = "center" width= "400">
	      <b>Title</b>
     </td>
     <td class="body2" align = "center" width = "150">
	       <b>Price</b>
	 </td>
	 <td class="body2" align = "center" width = "80">
	       <b>QTY Available</b>
	 </td>
	 <td class="body2" align = "center">
	       <b>Actions</b>
	  </td>
	</tr>
	<tr><td class = "body2" colspan= "6" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>

	
	
   <% end if 
	
	
	While Not rs.eof %>
	
	
	<%	SponsorshipLevelID = rs("SponsorshipLevelID")
		SponsorshipLevelName= rs("SponsorshipLevelName")
		SponsorshipLevelDescription= rs("SponsorshipLevelDescription")
		SponsorshipLevelPrice = rs("SponsorshipLevelPrice")
		SponsorshipLevelQTYAvailable = rs("SponsorshipLevelQTYAvailable")
		SponsorshipLevelMaxQtyPer = rs("SponsorshipLevelMaxQtyPer")

		
		
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
	       <a href = "SponsorEditDetails.asp?SponsorshipLevelID=<%=SponsorshipLevelID%>&SponsorshipLevelName=<%=SponsorshipLevelName%>&EventID=<%=EventID%>"><%=SponsorshipLevelName %></a>
	     </td>
	     <td class="body2" >
	        <a href = "SponsorEditDetails.asp?SponsorshipLevelID=<%=SponsorshipLevelID%>&SponsorshipLevelName=<%=SponsorshipLevelName%>&EventID=<%=EventID%>"><%=SponsorshipLevelPrice%></a>
	     </td>
	     <td class="body2" >
	       <a href = "SponsorEditDetails.asp?SponsorshipLevelID=<%=SponsorshipLevelID%>&SponsorshipLevelName=<%=SponsorshipLevelName%>&EventID=<%=EventID%>"><%=SponsorshipLevelQTYAvailable%></a>
	     </td>
     	<td class="body2" align = "center">
	      <a href = "SponsorEditDetails.asp?SponsorshipLevelID=<%=SponsorshipLevelID%>&SponsorshipLevelName=<%=SponsorshipLevelName%>&EventID=<%=EventID%>"><img src = "images/Edit.gif" width = "15" border = "0" alt = "Edit Class"></a>&nbsp;&nbsp;&nbsp; 
	      <a href = "SponsorDeleteHandleForm.asp?SponsorshipLevelID=<%=SponsorshipLevelID%>&SponsorshipLevelName=<%=SponsorshipLevelName%>&EventID=<%=EventID%>"><img src = "images/delete.jpg" width = "15" border = "0" alt = "Delete Sponsorship Option"></a>&nbsp;&nbsp;&nbsp;
	     </td>
	   </tr>
  
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
</table>

</form>
<% end if %>



<!--#Include virtual="Footer.asp"-->

</Body>
</HTML>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Other Pages</title>
<meta http-equiv="Content-Language" content="en-us">
<script type="text/javascript" src="/usableforms.js"></script>
<script language="JavaScript" src="/calendar_us.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

<script type="text/javascript">function EventTypeFormSubmit() {document.EventTypeForm.submit();}</script>
<script type="text/javascript">function EventServicesFormSubmit() {document.EventServicesForm.submit();}</script>
</head>
<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>

<% Current = "admin" %>
<!--#Include file="AdminEventsHeader.asp"-->
<% Current = "Other" %>
<!--#Include file="OverviewHeader.asp"-->
<!--#Include file="Scripts.asp"-->

<%
EventID = request.querystring("EventID")
%>

	
   <% PageTitleText = "Other Pages"  %>
<!--#Include file="970Top.asp"-->

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5 width = "860" align = "center">
	<tr>
	   
 <td valign = "top" class = "body">Select the links below to edit the content on some of these other handy pages:
<ul> 
  <% Addlater = True
  if  Addlater =  False then %>  <li><a href = "Testimonialsadmin.asp&EventID=<%=EventID%>" class = "body">Testimonials</a></li>
    <li><a href = "EditGalleryImages.asp&EventID=<%=EventID%>" class = "body">Photo Gallery</a></li>
  <% end if  %>
     <li> <a href = "PageData2.asp?Header=Other&pagename=Fiber Arts Show&EventID=<%=eventID%>"  class = "body">Fiber Arts</a></li>
    <li><a href = "PageData2.asp?Header=Other&pagename=Photo Contest&EventID=<%=eventID%>" class = "body">Photo Contest</a></li>
    <li><a href = "PageData2.asp?Header=Other&pagename=Accomodations&EventID=<%=eventID%>" class = "body">Accomodations</a></li>
     <li> <a href = "PageData2.asp?Header=Other&pagename=Driving Directions&EventID=<%=eventID%>" class = "body">Driving Directions</a></li>

    </ul>

  <br>
</td>
</tr>
</table>

   
	
<!--#Include file="970Bottom.asp"-->
<!--#Include file="Footer.asp"-->
</Body>
</html>
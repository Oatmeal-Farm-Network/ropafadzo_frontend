<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Reports</title>
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
<% Current = "Reports" %>
<!--#Include file="OverviewHeader.asp"-->
<!--#Include file="Scripts.asp"--> 


  <table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "100%"><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Reports</div></H1>
</td></tr>
<tr><td class = "roundedBottom" >

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5 width = "100%" align = "center">
	<tr>
	   
 <td valign = "top" class = "body"> 
   <a href = "ReportRegistrationsListPrintable.asp" class = "body" target = "blank">List of Registrations</a>

</td>
</tr>
</table>
</td>
</tr>
</table>
<!--#Include file="Footer.asp"-->
</Body>
</html>
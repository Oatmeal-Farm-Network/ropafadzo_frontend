<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Formatting</title>
<meta http-equiv="Content-Language" content="en-us">

<script type="text/javascript" src="/usableforms.js"></script>
<script language="JavaScript" src="/calendar_us.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

<script type="text/javascript">function EventTypeFormSubmit() {document.EventTypeForm.submit();}</script>
<script type="text/javascript">function EventServicesFormSubmit() {document.EventServicesForm.submit();}</script>

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<% Current = "admin" %>
<!--#Include file="AdminEventsHeader.asp"-->
<% Current = "Formatting" %>
<!--#Include file="OverviewHeader.asp"-->
<!--#Include file="Scripts.asp"--> 

<!'--#Include file="FormattingHeader.asp"--> 

<%
EventID = request.querystring("EventID")
%>

<% PageTitleText = "Formate How Your Event Pages Look"  %>
<!--#Include file="970Top.asp"-->	
   

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5 width = "860" align = "center">
	<tr>
	   
 <td valign = "top" class = "body"> 
 Select the Links below to control how you event pages look:
    <ul>
    <li><a href = "StandardStylesMaster.asp?EventID=<%=EventID%>" class = "menu2">
	Layout</a></li>
    <li><a href = "LayoutEdit.asp?EventID=<%=EventID%>#Fonts" class = "menu2">
	Fonts</a></li>
    <li><a href = "StandardStylesMaster.asp?EventID=<%=EventID%>#Images" class = "menu2">
	Images</a></li>
    </ul>


  <br>
</td>
</tr>
</table>

 <!--#Include file="970Bottom.asp"-->	  
<!--#Include file="Footer.asp"-->
</Body>
</html>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4+0 Transitional//EN">
<HTML>
<HEAD>
 <title>Delete Event Page</title>
 <link rel="stylesheet" type="text/css" href="/administration/style.css">
</HEAD>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white" >
<!--#Include file="AdminEventGlobalVariables.asp"-->
<%
'response.write("DeleteEventhandleform" & "<br/>")
	'Dim ID
	EventID=Request.querystring("EventID") 
  
'response.write("EventID = " & EventID & "<br/>")
  
	Dim cmdDC, RecordSet
	Dim RecordToEdit, Updated
	Query =  " UPDATE Event Set Deleted = True , " 
    Query =  Query & " DeletedDate  = date(" & formatdatetime(Now,2) & ") " 
    Query =  Query & " where EventID = " & EventID & ";" 

	Conn.Execute(Query) 
response.redirect("Default.asp")
%>
</Body>
</HTML>

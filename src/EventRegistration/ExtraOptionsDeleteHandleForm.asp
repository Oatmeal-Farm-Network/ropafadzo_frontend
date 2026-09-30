<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Delete an Listing</title>
<link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include file="Header.asp"--> 
<!--#Include file="GlobalVariables.asp"--> 
<%  
ExtraOptionsID = request.querystring("ExtraOptionsID")
EventID = request.querystring("EventID")

Query =  "Delete * From ExtraOptions where ExtraOptionsID = " & ExtraOptionsID & ";" 
Conn.Execute(Query) 
	
set Conn = Nothing

response.redirect("ExtraOptionsEdit.asp?EventID=" & EventID )
%>

</Body>
</HTML>
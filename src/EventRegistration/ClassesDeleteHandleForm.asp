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
ClassInfoID = request.querystring("ClassInfoID")
EventID = request.querystring("EventID")
ClassInfoTitle = request.querystring("ClassInfoTitle")
ReturnPage = request.querystring("ReturnPage")
Query =  "Delete From ClassInfo where ClassInfoID = " & ClassInfoID & ";" 
response.write("Query=" & Query )

Conn.Execute(Query) 


	Query =  "Delete From ExtraOptions where ExtraOptionsName= '" & ClassInfoTitle & "' and  EventID = " & EventID & ";" 
response.Write("query=" & query)
Conn.Execute(Query) 
	
set Conn = Nothing
if len(ReturnPage) > 1 then
response.redirect(ReturnPage & "?EventID=" & EventID & "#Edit" )
else
response.redirect("ClassesHome.asp?EventID=" & EventID & "#Edit" )
end if
%>

</Body>
</HTML>
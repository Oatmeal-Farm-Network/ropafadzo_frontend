<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Remove Image</title>
       <link rel="stylesheet" type="text/css" href="style.css">


<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >

<!--#Include file="globalvariables.asp"--> 
<!--#Include File="Header.asp"--> 



<%


PeopleID = request.Form("PeopleID")

	Query =  " UPDATE People Set PeopleImage1 = ' '  " 
	Query =  Query & " where PeopleID = " & PeopleID & "" 
	


Conn.Execute(Query) 


Response.Redirect("ClassesEditInstructorsDetails.asp?EventID=" & session("EventID") & "&PeopleID=" & PeopleID  )
%>

	<!--#Include File="Footer.asp"--> 
 </Body>
</HTML>

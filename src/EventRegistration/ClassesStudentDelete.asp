<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Remove Image</title>
       <link rel="stylesheet" type="text/css" href="style.css">

</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >

<!--#Include file="globalvariables.asp"--> 
<!--#Include File="Header.asp"--> 



<%


PeopleID = request.querystring("PeopleID")

Query =  "Delete * From ClassReg where PeopleID = " & PeopleID & ";" 
response.write("query=" & Query)
Conn.Execute(Query) 
	

set Conn = Nothing
Response.Redirect("StudentsEdit.asp?EventID=" & session("EventID") & "&PeopleID=" & PeopleID  )
%>
 </Body>
</HTML>

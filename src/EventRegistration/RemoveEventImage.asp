<!DOCTYPE html>
<HEAD>
 <title>Remove Logo</title>
       <link rel="stylesheet" type="text/css" href="style.css">

</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include file="globalvariables.asp"--> 
<!--#Include file="Header.asp"--> 

<%
CustID = Session("CustID")

Query =  " UPDATE EventSiteDesignTemp Set EventImage = ''  " 
	Query =  Query & " where EventID = " & EventID  

Conn.Execute(Query) 



	Set Conn = Nothing 
 Response.Redirect("EditEventHome.asp?EventID=" & EventID) %>


 </Body>
</HTML>

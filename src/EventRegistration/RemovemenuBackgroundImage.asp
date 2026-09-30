<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>

       <link rel="stylesheet" type="text/css" href="style.css">


</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include file="GlobalVariables.asp"-->
<%



Query =  " UPDATE EventSiteDesignTemp Set MenuBackgroundImage = '0'  " 
Query =  Query & " where EventID = " & EventID 


response.write("Query = " & Query)

response.write("DatabasePath = " & DatabasePath)	


Conn.Execute(Query) 

	  rowcount= rowcount +1


	Conn.Close
	Set Conn = Nothing 

response.redirect("LayoutImages.asp?EventID=" & EventID)
%>


 </Body>
</HTML>

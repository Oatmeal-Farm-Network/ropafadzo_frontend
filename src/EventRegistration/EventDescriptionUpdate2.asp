<!DOCTYPE html>
<html>
<HEAD>

       <link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  >
<!--#Include file="Globalvariables.asp"-->


<%
'rowcount = CInt
rowcount = 1

EventDescription4= Request.Form("EventDescription4")
EventID = Request.Querystring("EventID")
PageLayoutID = Request.Form("PageLayoutID")

	Dim str1
	Dim str2
	str1 = EventDescription
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		EventDescription= Replace(str1,  str2, "''")
	End If  

	
	Query =  " UPDATE EventPageLayout2 Set PageText = '" & EventDescription4 & "' " 
    Query =  Query & " where BlockNum = 4 and PageLayoutID = " & PageLayoutID & ";"  
	response.write(Query)	

	Conn.Execute(Query) 


   

set Conn = Nothing


Response.Redirect("EditEventHome.asp?EventID=" & EventID & "#Description"  )

 %>
</Body>
</HTML>


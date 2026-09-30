<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Delete a Member</title>
       <link rel="stylesheet" type="text/css" href="/administration/style.css">
</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include file="GlobalVariables.asp"-->
<!--#Include file="Header.asp"-->
<!--#Include virtual="UsersHeader.asp"-->
<%

dim OldMemberID2

	OldMemberID2=Request.Form("OldMemberID" ) 

If Len(OldMemberID2)  > 0 then
	Query =  "Delete * From Users where CustID = " &  OldMemberID2 & "" '
	'response.write(Query)
		Set DataConnection = Server.CreateObject("ADODB.Connection")
DataConnection.Open "DRIVER={Microsoft Access Driver (*.mdb)};DBQ=" & Server.MapPath(DatabasePath) & ";" 
DataConnection.Execute(Query) 
DataConnection.close
end if
Set DataConnection = Nothing
 
 Response.redirect("AdminUserDelete.asp?Message=The user has successfully been deleted.")
 %>
 

 </Body>
</HTML>

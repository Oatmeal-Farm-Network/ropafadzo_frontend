<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Add Members</title>
       <link rel="stylesheet" type="text/css" href="/administration/style.css">


</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">


<!--#Include virtual="/Administration/Header.asp"--> 
<%


TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
'rowcount = CInt(rowcount)
rowcount = 0
		
	NewCustFirstName=Request.Form("NewCustFirstName") 
	NewCustCompany=Request.Form("NewCustCompany")
	NewCustEmail=Request.Form("NewCustEmail")

If Not(session("Oldname") = NewCustFirstName) then
session("Oldname") = NewCustFirstName


if len(NewCustFirstName) > 3 then

Query =  "INSERT INTO sfCustomers (CustFirstName, Activemember, custPasswd, CustEmail, CustCompany)" 
	Query =  Query & " Values ('" &  NewCustFirstName & "', "
	Query =  Query & " True, "
	Query =  Query & " 'Password', "
    Query =  Query &  " '" & NewCustEmail & "'," 
	Query =  Query &  " '" & NewCustCompany & "' )" 


'response.write(Query)	

Dim DataConnection, cmdDC, RecordSet
Dim RecordToEdit, Updated
Set DataConnection = Server.CreateObject("ADODB.Connection")

DataConnection.Open "DRIVER={Microsoft Access Driver (*.mdb)};DBQ=" & Server.MapPath(DatabasePath) & ";" 



DataConnection.Execute(Query) 



IF DataConnection.Errors.Count <> 0 then
     Call MyErrorHandler(oDBConn, sSQL)  ' pass database connection as param
 Else
 %>
<div align = "center"><H2>
<%
     response.write("Your changes have successfully been made.")
  %></H2>

<%

 End If

	DataConnection.Close
	Set DataConnection = Nothing 
end if 

End if
%>

<!--#Include virtual="/Administration/EditMembersInclude.asp"--> 
<!--#Include virtual="/Administration/Footer.asp"--> </Body>
</HTML>

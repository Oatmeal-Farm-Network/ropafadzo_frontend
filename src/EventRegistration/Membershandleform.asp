<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
<!--#Include file="GlobalVariables.asp"-->

 <title>Account Maintanance</title>
       <link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">
<!--#Include virtual="/administration/Header.asp"--> 
<!--#Include virtual="/administration/membersHeader.asp"--> 
<%

Dim TotalCount
dim rowcount
dim CustIDArray(800)
dim CustFirstNameArray(800)
dim CustCompanyArray(800)
dim ActiveMemberArray(800)
dim AccessLevelArray(800)

TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
rowcount = 1

while (rowcount < TotalCount)
	CustIDArraycount = "CustID(" & rowcount & ")"	
	CustFirstNameArraycount = "CustFirstName(" & rowcount & ")"
	CustCompanyArraycount = "CustCompany(" & rowcount & ")"
	ActiveMemberArraycount = "ActiveMember(" & rowcount & ")"
	AccessLevelArraycount = "AccessLevel(" & rowcount & ")"

	CustIDArray(rowcount)=Request.Form(CustIDArraycount) 
	CustFirstNameArray(rowcount)=Request.Form(CustFirstNameArraycount) 
	CustCompanyArray(rowcount)=Request.Form(CustCompanyArraycount )
	ActiveMemberArray(rowcount)=Request.Form(ActiveMemberArraycount )
	AccessLevelArray(rowcount)=Request.Form(AccessLevelArraycount )


	rowcount = rowcount +1
Wend

 rowcount =1

while (rowcount < TotalCount)

str1 = CustFirstNameArray(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	CustFirstNameArray(rowcount)= Replace(str1, "'", "''")
End If



str1 = CustCompanyArray(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	CustCompanyArray(rowcount)= Replace(str1, "'", "''")
End If

	Query =  " UPDATE sfCustomers Set CustFirstName = '" &  CustFirstNameArray(rowcount) & "', " 
    Query =  Query + "  ActiveMember = " & ActiveMemberArray(rowcount) & "," 
	Query =  Query + "  CustCompany = '" & CustCompanyArray(rowcount) & "'," 
    Query =  Query + "  AccessLevel = " & AccessLevelArray(rowcount) & "" 
	Query =  Query + " where CustID = " & CustIDArray(rowcount) & ";" 

'response.write(Query)	

Dim DataConnection, cmdDC, RecordSet
Dim RecordToEdit, Updated
Set DataConnection = Server.CreateObject("ADODB.Connection")

DataConnection.Open "DRIVER={Microsoft Access Driver (*.mdb)};DBQ=" & Server.MapPath(databasepath) & ";" 

DataConnection.Execute(Query) 

	  rowcount= rowcount +1
	Wend

IF DataConnection.Errors.Count <> 0 then
     Call MyErrorHandler(oDBConn, sSQL)  ' pass database connection as param
 Else
 %>
<div align = "center"><H2>
<%
     response.write("Your changes have successfully been made.")
  %></H2>
</div>
<%

 End If

	DataConnection.Close
	Set DataConnection = Nothing 

%>

<!--#Include virtual="/Administration/EditMembersInclude.asp"--> 

<!--#Include virtual="/administration/Footer.asp"--> </Body>
</HTML>

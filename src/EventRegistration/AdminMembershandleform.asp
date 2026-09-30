<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
<!--#Include file="GlobalVariables.asp"-->
<!--#Include file="Header.asp"-->
<!--#Include virtual="UsersHeader.asp"-->

 <title>Add a user</title>
       <link rel="stylesheet" type="text/css" href="style.css">

</HEAD>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<%

Dim TotalCount
dim rowcount
dim CustID(800)
dim CustFirstName(800)
dim CustLastName(800)
dim CustEmail(800)
dim AccessLevel(800)

TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
rowcount = 1

while (rowcount < TotalCount)
	CustIDcount = "CustID(" & rowcount & ")"	
	CustFirstNamecount = "CustFirstName(" & rowcount & ")"
	CustLastNamecount = "CustLastName(" & rowcount & ")"
	CustEmailcount = "CustEmail(" & rowcount & ")"
	AccessLevelcount = "AccessLevel(" & rowcount & ")"

	CustID(rowcount)=Request.Form(CustIDcount) 
	CustFirstName(rowcount)=Request.Form(CustFirstNamecount) 
	CustLastName(rowcount)=Request.Form(CustLastNamecount )
	CustEmail(rowcount)=Request.Form(CustEmailcount )
	AccessLevel(rowcount)=Request.Form(AccessLevelcount )


	rowcount = rowcount +1
Wend

 rowcount =1

while (rowcount < TotalCount)

str1 = CustFirstName(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	CustFirstName(rowcount)= Replace(str1, "'", "''")
End If

str1 = CustEmail(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	CustEmail(rowcount)= Replace(str1, "'", "''")
End If


str1 = CustLastName(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	CustLastName(rowcount)= Replace(str1, "'", "''")
End If

	Query =  " UPDATE Users Set CustFirstName = '" &  CustFirstName(rowcount) & "', " 
    Query =  Query & "  CustLastName = '" & CustLastName(rowcount) & "'," 
	Query =  Query & "  CustEmail = '" & CustEmail(rowcount) & "'," 
    Query =  Query & "  AccessLevel = " & AccessLevel(rowcount) & "" 
	Query =  Query & " where CustID = " & CustID(rowcount) & " and EventID= " & EventID & ";" 

'response.write(Query)	

Dim DataConnection, cmdDC, RecordSet
Dim RecordToEdit, Updated
Set DataConnection = Server.CreateObject("ADODB.Connection")

DataConnection.Open "DRIVER={Microsoft Access Driver (*.mdb)};DBQ=" & Server.MapPath(DatabasePath) & ";"
DataConnection.Execute(Query) 
DataConnection.close
	  rowcount= rowcount +1
	Wend
Set conn = Nothing

response.redirect("AdminMembersEdit.asp")
 %>

 </Body>
</HTML>

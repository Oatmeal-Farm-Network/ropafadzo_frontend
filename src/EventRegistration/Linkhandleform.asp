<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Edit Links</title>
       <link rel="stylesheet" type="text/css" href="style.css">
</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include File="GlobalVariables.asp"--> 

<!--#Include File="Header.asp"--> 
<%
	Dim LinkIDx(40000)
	dim Linkx(40000)
	dim LinkTextx(40000)
	dim LinkDescriptionx(40000)
	dim CatIDx(40000)


	dim TotalCount
	dim rowcount

TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
'rowcount = CInt(rowcount)
rowcount = 1

while (rowcount < TotalCount)
	LinkIDcount = "LinkID(" & rowcount & ")"	
	Linkcount = "Link(" & rowcount & ")"	
	LinkTextcount = "LinkText(" & rowcount & ")"	
	LinkDescriptioncount = "LinkDescription(" & rowcount & ")"	
	CatIDcount = "CatID(" & rowcount & ")"	
	
	LinkIDx(rowcount)=Request.Form(LinkIDcount) 
	Linkx(rowcount)=Request.Form(Linkcount) 
	LinkTextx(rowcount)= Request.Form(LinkTextcount) 
	LinkDescriptionx(rowcount) = Request.Form(LinkDescriptioncount) 
	CatIDx(rowcount) = Request.Form(CatIDcount) 

	rowcount = rowcount +1
Wend

 rowcount =1

while (rowcount < TotalCount)

'str1 = FullName(rowcount)
'str2 = "'"
'If InStr(str1,str2) > 0 Then
	'FullName(rowcount)= Replace(str1, "'", "''")
'End If


str1 = LinkDescriptionx(rowcount)
str2 = "'"
If InStr(str1,str2) > 0 Then
	LinkDescriptionx(rowcount)= Replace(str1, "'", "''")
End If


	Query =  " UPDATE Links Set CatID = " & catIDx(rowcount) & ","
	Query =  Query + " link = '" & Linkx(rowcount) & "'," 
	Query =  Query + " LinkText = '" & LinkTextx(rowcount) & "'," 
	Query =  Query + " linkDescription = '" & LinkDescriptionx(rowcount) & "'" 
    Query =  Query + " where LinkID = " & LinkIDx(rowcount) & ";" 
'response.write(Query)

Dim DataConnection, cmdDC, RecordSet
Dim RecordToEdit, Updated
Set DataConnection = Server.CreateObject("ADODB.Connection")

DataConnection.Open "DRIVER={Microsoft Access Driver (*.mdb)};DBQ=" & Server.MapPath(DatabasePath)& ";" 



DataConnection.Execute(Query) 

	  rowcount= rowcount +1
	Wend

IF DataConnection.Errors.Count <> 0 then
     Call MyErrorHandler(oDBConn, sSQL)  ' pass database connection as param
 Else

 End If

	DataConnection.Close
	Set DataConnection = Nothing 

		Response.Redirect("/Administration/LinkMaintenance.asp")
%>
</Body>
</HTML>

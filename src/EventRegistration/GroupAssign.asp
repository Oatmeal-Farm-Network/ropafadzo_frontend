<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4+0 Transitional//EN">
<HTML>
<HEAD>
 <title>Assiogn groups Results Page</title>
      <link rel="stylesheet" type="text/css" href="/administration/style.css">
</HEAD>

<BODY bgcolor = "white">
<!--#Include virtual="/Administration/Header.asp"--> 
<%

Dim TotalCount
dim rowcount
dim	ID(40000) 
dim	GroupID(40000) 

TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
'rowcount = CInt(rowcount)
rowcount = 1

while (rowcount < TotalCount)
    IDcount = "ID(" & rowcount & ")"
	GroupIDcount = "GroupID(" & rowcount & ")"


	ID(rowcount)=Request.Form(IDcount) 
	GroupID(rowcount)=Request.Form(GroupIDcount) 

	rowcount = rowcount +1

Wend

 rowcount =1

while (rowcount < TotalCount)

if GroupID(rowcount) = "" then
	GroupID(rowcount) = "0"
end if


	Query =  " UPDATE Animals Set  GroupID = " +  GroupID(rowcount) + "" 
    Query =  Query + " where ID = " + ID(rowcount) + ";" 

'response.write(Query)
Dim DataConnection, cmdDC, RecordSet
Dim RecordToEdit, Updated
Set DataConnection = Server.CreateObject("ADODB.Connection")

DataConnection.Open "DRIVER={Microsoft Access Driver (*.mdb)};DBQ=" & Server.MapPath(DatabasePath) & ";" 

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

<%

 End If

	DataConnection.Close
	Set DataConnection = Nothing 

%>

<table width = "660" align = "center">
	<tr >
		<td align = "right">
			<br><a  class = "Links" href="Groups.asp"> Return to the Assign Groups Page</a>
			<br>
		</td>
	</tr>
</table>
<!--#Include virtual="/Administration/Footer.asp"--> </Body>
</HTML>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4+0 Transitional//EN">
<HTML>
<HEAD>
 <title>Animal Description Results Page</title>
       <link rel="stylesheet" type="text/css" href="style.css">
</HEAD>

<BODY  bgcolor = "white">
<!--#Include virtual="/administration/Header.asp"--> 
<%

Dim TotalCount
dim rowcount
dim ID
dim FullName
dim Comments

	
	ID=Request.Form("ID") 
	FullName=Request.Form("FullName") 
	Comments=Request.Form("Comments") 
	

str1 = Comments
str2 = "'"
If InStr(str1,str2) > 0 Then
	Comments= Replace(str1, "'", "''")
End If

	Query =  " UPDATE Animals Set Description = '" &  Comments & "' " 
    Query =  Query + " where ID = " & ID & ";" 

Response.write(Query) 


Dim DataConnection, cmdDC, RecordSet
Dim RecordToEdit, Updated
Set DataConnection = Server.CreateObject("ADODB.Connection")

DataConnection.Open "DRIVER={Microsoft Access Driver (*.mdb)};DBQ=" & Server.MapPath(databasepath) & ";" 



DataConnection.Execute(Query) 


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

<table width = "660" align = "center">
	<tr >
		<td align = "right">
			<br><a  class = "Links" href="DescriptionData.asp"> Return to the Animal Description Page</a>
			<br>
		</td>
	</tr>
</table>
<!--#Include virtual="/administration/Footer.asp"--> </Body>
</HTML>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4+0 Transitional//EN">
<HTML>
<HEAD>
 <title>Pricing Results Page</title>
       <link rel="stylesheet" type="text/css" href="/administration/<%=Style%>">
</HEAD>

<BODY>
<!--#Include file="/Administration/Header.asp"--> 
<%

Dim TotalCount
dim rowcount
dim ID(40000)
dim FullName(40000)
dim ListPageImage(40000)
dim FiberImage(40000)
dim ARI(40000)
dim DetailPageImage(40000)

TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
'rowcount = CInt(rowcount)
rowcount = 1

while (rowcount < TotalCount)
	IDcount = "ID(" & rowcount & ")"	
	FullNamecount = "Name(" & rowcount & ")"
	ListPageImagecount = "ListPageImage(" & rowcount & ")"
	FiberImagecount = "FiberImage(" & rowcount & ")"
	ARIcount = "ARI(" & rowcount & ")"
	DetailPageImagecount = "DetailPageImage(" & rowcount & ")"
	
	ID(rowcount)=Request.Form(IDcount) 
	FullName(rowcount)=Request.Form(FullNamecount) 
	ListPageImage(rowcount)=Request.Form(ListPageImagecount)
	FiberImage(rowcount)=Request.Form(FiberImagecount) 
	ARI(rowcount)=Request.Form(ARIcount) 
	DetailPageImage(rowcount)=Request.Form(DetailPageImagecount) 
	rowcount = rowcount +1



Wend

 rowcount =1

while (rowcount < TotalCount)

str1 = ListPageImage(rowcount)
If  str1= " " or str1="" Then
	ListPageImage(rowcount) = "0"
End If

str2 = FiberImage(rowcount) 
If  str2= " " or str2="" Then
	FiberImage(rowcount) = "0"
End If

str2 = ARI(rowcount)
If  str2= " " or str2="" Then
	ARI(rowcount) = "0"
End If

str2 = DetailPageImage(rowcount) 
If  str2= " " or str2="" Then
	DetailPageImage(rowcount) = "0"
End If

str2 = ID(rowcount) 
If  str2= " " or str2="" Then
	ID(rowcount) = "0"
End If

	Query =  " UPDATE Photos Set ListPageImage = '" +  ListPageImage(rowcount) + "', " 
    Query =  Query + "  FiberImage = '" +  FiberImage(rowcount) + "'," 
	Query =  Query + "  ARI = '" +  ARI(rowcount) + "'," 
	Query =  Query + "  DetailPageImage = '" +  DetailPageImage(rowcount) + "'" 
    Query =  Query + " where ID = " + ID(rowcount) + ";" 

'response.write(Query)	

Dim DataConnection, cmdDC, RecordSet
Dim RecordToEdit, Updated
Set DataConnection = Server.CreateObject("ADODB.Connection")

DataConnection.Open "DRIVER={Microsoft Access Driver (*.mdb)};DBQ=" & Server.MapPath("/AlpacaData.mdb") & ";" 



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
			<br><a  class = "Links" href="PhotosData.asp"> Return to Edit Photo Page</a>
			<br>
		</td>
	</tr>
</table>
<!--#Include file="/Administration/Footer.asp"--> 
</BODY>
</HTML>

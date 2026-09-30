<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4+0 Transitional//EN">
<HTML>
<HEAD>
 <title>Photo Order Results Page</title>
        <link rel="stylesheet" type="text/css" href="/administration/<%=Style%>">
</HEAD>

<BODY  background = "images/background.jpg">
<!--#Include file="/Administration/Header.asp"--> 
<table background = "/images/Background.jpg" width = "776"  align = "center" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" border=0 	cellpadding=0 cellspacing=0 >
	<tr>
		</td>
<%
Dim TotalCount
dim rowcount
dim PID(500)
dim Order(500)

TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)

rowcount = 1

while (rowcount < TotalCount)
PIDcount = "PID(" & rowcount & ")"
Ordercount = "Order(" & rowcount & ")"

PID(rowcount)=Request.Form(PIDcount) 
Order(rowcount)=Request.Form(Ordercount) 

rowcount = rowcount +1
Wend

 rowcount =1

while (rowcount < TotalCount)

	Query =  " UPDATE AdditionalPhotos Set PhotoOrder = '" +  Order(rowcount) + "' " 
    Query =  Query + " where PhotoID = " + PID(rowcount) + ";" 
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
</div>
<%

 End If

	DataConnection.Close
	Set DataConnection = Nothing 

%>

</td>
</tr>
	<tr >
		<td align = "right">
			<br><a  class = "body" href="PhotosData.asp"> Return to the Associate Images Page</a>
			<br>
		</td>
	</tr>
</table>
</BODY>
</HTML>

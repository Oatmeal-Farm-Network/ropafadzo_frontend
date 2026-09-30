<html>

<head>

<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Registry Registration</title>

<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="Style.css">

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include file="Header.asp"--> 

<%
'rowcount = CInt
rowcount = 1 

'ProdID
'RequestedNumber
'Delete

dim	ProdID(40000) 
dim	RequestedNumber(40000) 
dim	Delete(40000) 


TotalCount= Request.Form("TotalCount")
TotalCount = CInt(TotalCount)
response.write(TotalCount)
rowcount = 1

while (rowcount < TotalCount +1)
    ProdIDcount = "ProdID(" & rowcount & ")"
	RequestedNumbercount = "RequestedNumber(" & rowcount & ")"
	Deletecount = "Delete(" & rowcount & ")"

	ProdID(rowcount)=Request.Form(ProdIDcount) 
	response.write(ProdID(rowcount))
	RequestedNumber(rowcount)=Request.Form(RequestedNumbercount) 
	Delete(rowcount)=Request.Form(Deletecount) 
	
	rowcount = rowcount +1
Wend

rowcount =1
while (rowcount < TotalCount+1)

	If Delete(rowcount) = "on" Then
		Query =  "Delete * From Registryitems where ProdID = '" & ProdID(rowcount) & "' and RegcustID = " & session("RegcustID")
	else
		Query =  " UPDATE Registryitems Set RequestedNumber = " &  RequestedNumber(rowcount) & " " 
		Query =  Query & " where ProdID = '" & ProdID(rowcount) & "';" 
	End If 
	'response.write(Query)
	Conn.Execute(Query) 
	rowcount = rowcount +1 
wend

'response.redirect("Reglist.asp")
%>
	

		</Body>
</HTML>


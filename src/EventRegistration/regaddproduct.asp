<html>

<head>

<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Registry Add Product</title>

<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="BarnStyle.css">

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >



<%


'rowcount = CInt

Quantity=Request.Form("Quantity") 
ProdID=Request.Form("ProdID") 
RegcustID=Request.Form("RegcustID") 
CatID=Request.Form("CatID") 

	Query =  "INSERT INTO Registryitems (RegcustID, ProdID, RequestedNumber, PurchasedNumber)" 
		Query =  Query + " Values ('" & session("RegcustID") & "'," 
		Query =  Query & " " &  ProdID & "," 
		Query =  Query & " " &  quantity & "," 
		Query =  Query & " 0 )"
		'response.write(query)

Dim cmdDC, RecordSet
Dim RecordToEdit, Updated
Conn.Execute(Query) 
redirectpath = "regSearchResults.asp?CatID=" & CatID
response.redirect(redirectpath)
%>
		
		</Body>
</HTML>


<html>

<head>

<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Confirm Registry Registration</title>

<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="Style.css">


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >


<!--#Include file="Header.asp"--> 


<%


EventID = request.form("EventID")
if len(EventID) < 1 then
	EventID = Session("EventID")
else
 Session("EventID") = EventID
end if

PeopleID = request.form("PeopleID")
'response.write("PeopleId = " & PeopleID )

if len(PeopleID) < 1 then
	PeopleID = Session("PeopleID")
else
 	Session("PeopleID") = PeopleID
end if








dim TotalCost(1000)
dim ItemTypeArray(1000)
dim ItemArray(1000)
dim odrdttmpQuantity(1000)
dim Remove(1000)
dim IDArray(1000)

TotalCount = Request.Form("TotalCount")
response.write("TotalCount = " & Totalcount )

rowcount = 1
While rowcount < TotalCount +1

ItemTypeArraycount = "ItemTypeArray(" & rowcount & ")"
ItemArraycount = "ItemArray(" & rowcount & ")"
odrdttmpQuantitycount = "odrdttmpQuantity(" & rowcount & ")"
Removecount = "Remove(" & rowcount & ")"
IDArraycount = "IDArray(" & rowcount & ")"


ItemTypeArray(rowcount)=Request.Form(ItemTypeArraycount)
ItemArray(rowcount)=Request.Form(ItemArraycount)
odrdttmpQuantity(rowcount)=Request.Form(odrdttmpQuantitycount)
Remove(rowcount)=Request.Form(Removecount)
IDArray(rowcount)=Request.Form(IDArraycount)

Response.write("rowcount=" & rowcount & " <br>" )
Response.write("ItemTypeArray(rowcount)=" & ItemTypeArray(rowcount) & " <br>" )
Response.write("ItemArray(rowcount)=" & ItemArray(rowcount) & " <br>" )
Response.write("odrdttmpQuantity(rowcount)=" & odrdttmpQuantity(rowcount) & " <br>" )
Response.write("Remove(rowcount)=" & Remove(rowcount) & " <br>" )
Response.write("IDArray(rowcount)=" & IDArray(rowcount) & " <br>" )


rowcount = rowcount + 1
Wend 


rowcount = 1
While rowcount < TotalCount +1

if ItemTypeArray(rowcount)= "Sponsor" then

if Remove(rowcount) = "Yes" then
 Query =  "Delete * From Sponsor where SponsorID = " & IDArray(rowcount) & ";" 


Else

	Query =  " UPDATE Sponsor Set SponsorQTY = " & odrdttmpQuantity(rowcount) & "" 
	Query =  Query & " where SponsorID = " & IDArray(rowcount) & ";" 

end if
end if 


if ItemTypeArray(rowcount)= "Vendor" then

if Remove(rowcount) = "Yes" then
 Query =  "Delete * From Vendor where VendorID = " & IDArray(rowcount) & ";" 


Else

	Query =  " UPDATE Vendor Set VendorBoothQTY = " & odrdttmpQuantity(rowcount) & "" 
	Query =  Query & " where VendorID = " & IDArray(rowcount) & ";" 

end if
end if


response.write(Query)	
Dim cmdDC, RecordSet
Dim RecordToEdit, Updated
Conn.Execute(Query) 
rowcount = rowcount + 1
Wend 

response.redirect("regConfirmationStep2.asp?EventID="& eventID & "&PeopleID=" & PeopleID)
%>

</Body>
</HTML>
<html>

<head>

<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Confirm Registry Registration</title>

<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="Style.css">

 
<script type="text/javascript" src="/usableforms.js"></script>
<script language="JavaScript" src="/calendar_us.js"></script>
<script type="text/javascript" src="jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >


<!--#Include file="Header.asp"--> 
<!--#Include file="Scripts.asp"--> 

<%


EventID = request.form("EventID")
if len(EventID) < 1 then
	EventID = Session("EventID")
else
 Session("EventID") = EventID
end if
response.write("EventID = " & EventID & "<br/>")

PeopleID = request.form("PeopleID")
response.write("A PeopleId = " & PeopleID  & "<br/>")

if len(PeopleID) < 1 then
	PeopleID = Session("PeopleID")
else
 	Session("PeopleID") = PeopleID
end if

response.write("B PeopleId = " & PeopleID  & "<br/>")


EventSubTypeID = request.form("EventSubTypeID")
sponsorshiprowcount = request.form("sponsorshiprowcount")

 
dim ASponsorshipLevelID(1000)
dim	ASponsorQtyOrdered(1000)
dim ASponsorOrdered(1000)
	
'rowcount = CInt
rowcount = 1

if sponsorshiprowcount > 0 then
while cint(rowcount) < cint(sponsorshiprowcount)
	SponsorshipLevelIDcount = "SponsorshipLevelID(" & rowcount & ")"	
	SponsorQtyOrderedcount = "SponsorQtyOrdered(" & rowcount & ")"	
	SponsorOrderedcount = "SponsorOrdered(" & rowcount & ")"
	
	ASponsorshipLevelID(rowcount)=Request.Form(SponsorshipLevelIDcount) 
	ASponsorQtyOrdered(rowcount)=Request.Form(SponsorQtyOrderedcount) 
	ASponsorOrdered(rowcount)=Request.Form(SponsorOrderedcount) 


	rowcount = rowcount +1
wend 

	rowcount = 1
	while cint(rowcount) < cint(sponsorshiprowcount)	
		if ASponsorOrdered(rowcount)="on" then
			Query =  "INSERT INTO Sponsor (SponsorshipLevelID, SponsorQTY,  EventID, PeopleID )"
			Query =  Query & " Values (" &  ASponsorshipLevelID(rowcount) & " ,"
			Query =  Query &   " " & ASponsorQtyOrdered(rowcount) & ","
			Query =  Query & " " &  EventID & " ,"
			Query =  Query &   " " & PeopleID & " )" 
			response.write("Query = " & Query & "<br/>")	
			Conn.Execute(Query) 
		end if
	 	rowcount = rowcount + 1
	Wend
	
 	rowcount =1
end if


vendorrowcount = request.form("vendorrowcount")

 
dim AvendorLevelID(1000)
dim	AvendorQtyOrdered(1000)
dim AvendorOrdered(1000)
	
'rowcount = CInt
rowcount = 1

response.write("vendorrowcount = " & vendorrowcount)	
if vendorrowcount > 0 then
while cint(rowcount) < cint(vendorrowcount)
	vendorLevelIDcount = "vendorLevelID(" & rowcount & ")"	
	vendorQtyOrderedcount = "vendorQtyOrdered(" & rowcount & ")"	
	vendorOrderedcount = "vendorOrdered(" & rowcount & ")"
	
	AvendorLevelID(rowcount)=Request.Form(vendorLevelIDcount) 
	AvendorQtyOrdered(rowcount)=Request.Form(vendorQtyOrderedcount) 
	AvendorOrdered(rowcount)=Request.Form(vendorOrderedcount) 


	rowcount = rowcount +1
wend 

rowcount = 1
while cint(rowcount) < cint(vendorrowcount)	
 if AvendorOrdered(rowcount)="on" then
 
Query =  "INSERT INTO vendor (vendorLevelID, VendorBoothQTY,  EventID, PeopleID )"
Query =  Query & " Values (" &  AvendorLevelID(rowcount) & " ,"
Query =  Query &   " " & AvendorQtyOrdered(rowcount) & ","
Query =  Query & " " &  EventID & " ,"
Query =  Query &   " " & PeopleID & " )" 
response.write("Query=" & Query)	
Conn.Execute(Query) 
  end if
 rowcount = rowcount + 1
Wend

 rowcount =1
end if


response.redirect("regConfirmationStep2.asp?EventID=" & EventID & "&PeopleID=" & PeopleID )
%>


</Body>
</HTML>
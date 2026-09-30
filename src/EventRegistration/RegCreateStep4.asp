<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Create Event</title>
<meta http-equiv="Content-Language" content="en-us">
<meta name="author" content="The Andresen Group"/>
<link rel="stylesheet" type="text/css" href="/style.css" />
</head>
<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>
<!--#Include file="AdminEventsHeader.asp"-->
<!--#Include file="Header.asp"-->
<%
EventTypeID = request.form("EventTypeID")
response.write("EventTypeID=" & EventTypeID)
PeopleID = request.querystring("PeopleID")

EventID = request.querystring("EventID")
if len(EventID) < 1 then
  EventID = Session("EventID")
end if

Response.write("RegCreateStep4 EventTypeID = " & EventTypeID & "<br/>")

'******************************************************************************************
'  FIND THE EVENT NAME
'******************************************************************************************

sql = "select EventName from Event where EventID = " & EventID 
'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	EventName = rs("EventName")
End If 

rs.close

Response.write("RegCreateStep4 EventName = " & EventName & "<br/>")



if len(PeopleID) < 0 then
  PeopleID = Session("PeopleID")

	if len(PeopleID) < 0 then
  	PeopleID= request.form("PeopleID")
	end if
end if


EventTypeID = request.Form("EventTypeID")

if len(EventTypeID) > 0 then

	
'******************************************************************************************
'  UPDATE THE EVENT TABLE
'******************************************************************************************

Query =  " UPDATE Event Set EventTypeID = " &  EventTypeID & "" 
Query =  Query & " where EventID = " & EventID & ";" 

response.write("<br>Update event Query = " & Query & "<br>")
Conn.Execute(Query) 
	
'******************************************************************************************
'  FIND THE Services
'******************************************************************************************
dim ServiceTypeIDArray(100)
dim ServiceTypeChecksArray(100)


i= 0
NoServiceTypes = True
sql = "select * from ServiceTypeLookup where EventTypeID = " & EventTypeID  &  ""
response.write("ServiceTypelookup sqL = " & sql & "<br>")
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

while Not rs.eof 
i = i + 1
  ServiceTypeIDArray(i) =  rs("ServiceTypeLookupID")
  
  If Request.Form("ServiceType" & i) = "" Then
   'response.write("I was NOT checked")
   else
    NoServiceTypes = False
    'response.write("I was checked")
End If
  ServiceTypeChecksArray(i) = Request.Form("ServiceTypeLookup1")
  
 response.write("ServiceTypeIDArray(i) = " & rs("ServiceTypeLookupID") & "<br>")
  
rs.movenext
wend
rs.close

end if

EventTypeID = request.querystring("EventTypeID")
response.Write("EventTypeID=" & EventTypeID )
if len(EventTypeID) < 1 then
  EventTypeID = Session("EventTypeID")
end if

EventID = request.querystring("EventID")
if len(EventID) < 1 then
  EventID = Session("EventID")
end if

	
'****************************************************************************************************
'  FIND THE EVENT TYPE
'****************************************************************************************************

sql = "select EventType from EventTypesLookup where EventTypeID = " & EventTypeID  &  ""

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

if Not rs.eof then
  EventType = rs("EventType")	
end if
rs.close


'****************************************************************************************************
'  FIND THE Points of Interest
'****************************************************************************************************
i=0
sql = "select * from ServiceTypeLookup where available = True and EventTypeID = " & EventTypeID  &  ""
response.write("sql = " & sql & "<br/>")
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

while Not rs.eof 
i=i +1

		NoServiceTypes = False

     	Query =  "INSERT INTO Services(ServiceTypeLookupID, EventID )" 
		Query =  Query & " Values ('" & rs("ServiceTypeLookupID")  & "'," 
		Query =  Query & " '" &  EventID & "')" 
		response.write(Query)
		Conn.Execute(Query) 



 rs.movenext
wend
rs.close


'**************************************************************
' Check if the Accomodations event is listed in EventPageLayout
'**************************************************************


	sql = "select * from EventPageLayout where PageName = 'Accomodations' and EventID = " & EventID

	
	
	rs.Open sql, conn, 3, 3
	If  rs.eof then
		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 16," 
		Query =  Query &  " 'Accomodations'," 
		Query =  Query &  " 'PageData2.asp?pagename=Accomodations&EventID=" & EventID & "'," 
		Query =  Query &  " 'Accomodations.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Accomodations'  ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"
		Conn.Execute(Query) 
			rs.close
		
		sql = "select PageLayoutID from EventPageLayout where EventID = " & EventID & " and LinkName='Accomodations'"
		rs.Open sql, conn, 3, 3
 				PageLayoutID = rs("PageLayoutID")
		
		
		X = 0
		while X < 9
		 X = X + 1 
			Query =  "INSERT INTO EventPageLayout2 (EventID, BlockNum, PageLayoutID )" 
			Query =  Query & " Values (" &  EventID & ", " 
			Query =  Query &  " " &  X & ", " 
  			Query =  Query &  " " & PageLayoutID & " )" 
		Conn.Execute(Query) 
		wend
	end if 
	rs.close




	'**************************************************************
	' Check if the Photo Gallery event is listed in EventPageLayout
	'**************************************************************
IncludeGallery = false
if IncludeGallery =True then

	sql = "select * from EventPageLayout where PageName = 'Photo Gallery' and EventID = " & EventID
	rs.Open sql, conn, 3, 3
	If  rs.eof then

		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 14," 
		Query =  Query &  " 'Photo Gallery'," 
		Query =  Query &  " 'EditGalleryImages.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'EventPhotoGallery.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Photo Gallery' ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"
		Conn.Execute(Query) 
		
		rs.close
		
		sql = "select PageLayoutID from EventPageLayout where EventID = " & EventID & " and LinkName='Photo Gallery'"
		rs.Open sql, conn, 3, 3
 				PageLayoutID = rs("PageLayoutID")
		
		
		X = 0
		while X < 9
		 X = X + 1 
			Query =  "INSERT INTO EventPageLayout2 (EventID, BlockNum, PageLayoutID )" 
			Query =  Query & " Values (" &  EventID & ", " 
			Query =  Query &  " " &  X & ", " 
  			Query =  Query &  " " & PageLayoutID & " )" 
 		
		Conn.Execute(Query) 
	wend
	end if 

rs.close

End if


	'**************************************************************
	' Check if the Testmonials event is listed in EventPageLayout
	'**************************************************************
IncludeTestimonials = false
if IncludeTestimonials =True then
	sql = "select * from EventPageLayout where PageName = 'Testmonials' and EventID = " & EventID
	rs.Open sql, conn, 3, 3
	If  rs.eof then
	rs.close
		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 15," 
		Query =  Query &  " 'Testmonials'," 
		Query =  Query &  " 'Testimonialsadmin.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Testmonials.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Testmonials'  ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"
 
		Conn.Execute(Query) 
	
		
		
		sql = "select PageLayoutID from EventPageLayout where EventID = " & EventID & " and LinkName='Testmonials'"
		rs.Open sql, conn, 3, 3
 				PageLayoutID = rs("PageLayoutID")
		
		
		X = 0
		while X < 9
		 X = X + 1 
			Query =  "INSERT INTO EventPageLayout2 (EventID, BlockNum, PageLayoutID )" 
			Query =  Query & " Values (" &  EventID & ", " 
			Query =  Query &  " " &  X & ", " 
  			Query =  Query &  " " & PageLayoutID & " )" 
 		
		Conn.Execute(Query) 
		wend
	end if 
	rs.close


End if

	'**************************************************************
	' Check if the Refunds is listed in EventPageLayout
	'**************************************************************
	sql = "select * from EventPageLayout where PageName = 'Refunds' and EventID = " & EventID
	rs.Open sql, conn, 3, 3
	If  rs.eof then
	rs.close
		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 17," 
		Query =  Query &  " 'Refunds'," 
		Query =  Query &  " 'PageData2.asp?pagename=Refunds&EventID=" & EventID & "'," 
		Query =  Query &  " 'EventRefunds.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Refunds'  ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"
	
		Conn.Execute(Query) 
		
		
		
		sql = "select PageLayoutID from EventPageLayout where EventID = " & EventID & " and LinkName='Refunds'"
		rs.Open sql, conn, 3, 3
 				PageLayoutID = rs("PageLayoutID")
		
		
		X = 0
		while X < 9
		 X = X + 1 
			Query =  "INSERT INTO EventPageLayout2 (EventID, BlockNum, PageLayoutID )" 
			Query =  Query & " Values (" &  EventID & ", " 
			Query =  Query &  " " &  X & ", " 
  			Query =  Query &  " " & PageLayoutID & " )" 
 		
		Conn.Execute(Query) 
		wend

	end if 
	rs.close





	'**************************************************************
	' Check if the Driving Directions is listed in EventPageLayout
	'**************************************************************
	sql = "select * from EventPageLayout where PageName = 'Driving Directions' and EventID = " & EventID
	rs.Open sql, conn, 3, 3
	If  rs.eof then
	rs.close
		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 18," 
		Query =  Query &  " 'Driving Directions'," 
		Query =  Query &  " 'PageData2.asp?pagename=Driving Directions&EventID=" & EventID & "'," 
		Query =  Query &  " 'DrivingDirections.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Driving Directions'  ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"
		Conn.Execute(Query) 
		
		
		
		sql = "select PageLayoutID from EventPageLayout where EventID = " & EventID & " and LinkName='Driving Directions'"
		rs.Open sql, conn, 3, 3
 				PageLayoutID = rs("PageLayoutID")
		
		
		X = 0
		while X < 9
		 X = X + 1 
			Query =  "INSERT INTO EventPageLayout2 (EventID, BlockNum, PageLayoutID )" 
			Query =  Query & " Values (" &  EventID & ", " 
			Query =  Query &  " " &  X & ", " 
  			Query =  Query &  " " & PageLayoutID & " )" 
		Conn.Execute(Query) 
 		wend

	end if 
	rs.close

		



	'**************************************************************
	' Check if the Halter is listed in EventPageLayout
	'**************************************************************
if HalterShowAvailable = True then
	sql = "select * from EventPageLayout where PageName = 'Halter Show' and EventID = " & EventID
	rs.Open sql, conn, 3, 3
	If  rs.eof then

		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 2," 
		Query =  Query &  " 'Halter'," 
		Query =  Query &  " 'HalterHome.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'EventHalter.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Halter Show' ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"
		Conn.Execute(Query) 
	
	
	
	Query =  "INSERT INTO ExtraOptions (EventID, OptionType, ExtraOptionsName )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 'Halter'," 
		Query =  Query &  " 'Free Halter Stall' )"
		Conn.Execute(Query) 
		
		
		Query =  "INSERT INTO ExtraOptions (EventID, OptionType, ExtraOptionsName )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 'Halter'," 
		Query =  Query &  " 'Free Display Stall' )"
		Conn.Execute(Query) 
		
		

	Query =  "INSERT INTO ExtraOptions (EventID, OptionType, ExtraOptionsName )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 'Halter'," 
		Query =  Query &  " 'Expidited Vet Check in' )"
		Conn.Execute(Query) 


'**************************************************************
	' Check if the Vet Check is listed in EventPageLayout
	'**************************************************************
		rs.close
	sql = "select * from EventPageLayout where PageName = 'Vet Check' and EventID = " & EventID
	rs.Open sql, conn, 3, 3
	If  rs.eof then

		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 4," 
		Query =  Query &  " 'Vet Check'," 
		Query =  Query &  " 'PageData2.asp?pagename=Vet Check&EventID=" & EventID & "&Header=Halter'," 
		Query =  Query &  " 'EventVetCheck.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Vet Check'  ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"
		Conn.Execute(Query) 
	

		rs.close
		sql = "select PageLayoutID from EventPageLayout where EventID = " & EventID & " and LinkName='Vet Check'"
		rs.Open sql, conn, 3, 3
 				PageLayoutID = rs("PageLayoutID")
		
		
		X = 0
		while X < 9
		 X = X + 1 
			Query =  "INSERT INTO EventPageLayout2 (EventID, BlockNum, PageLayoutID )" 
			Query =  Query & " Values (" &  EventID & ", " 
			Query =  Query &  " " &  X & ", " 
  			Query =  Query &  " " & PageLayoutID & " )" 
		Conn.Execute(Query) 
	 		wend
	end if 

	
	
	
		
	Query =  "INSERT INTO ExtraOptions (EventID, OptionType, ExtraOptionsName )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 'Halter'," 
		Query =  Query &  " 'Free Vet Check in' )"
		Conn.Execute(Query) 

	Query =  "INSERT INTO ExtraOptions (EventID, OptionType, ExtraOptionsName )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 'Halter'," 
		Query =  Query &  " 'Free Stall Mat' )"
		Conn.Execute(Query) 

	Query =  "INSERT INTO ExtraOptions (EventID, OptionType, ExtraOptionsName )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 'Halter'," 
		Query =  Query &  " 'Free Electricity' )"
 		Conn.Execute(Query) 

	end if 

rs.close	
end if


	'**************************************************************
	' Check if the Silent Auction is listed in EventPageLayout
	'**************************************************************
	if SilentAuctionAvailable = True then
	sql = "select * from EventPageLayout where PageName = 'Silent Auction' and EventID = " & EventID
	rs.Open sql, conn, 3, 3
	If  rs.eof then

		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 11," 
		Query =  Query &  " 'Silent Auction'," 
		Query =  Query &  " 'PageData2.asp?pagename=Silent Auction&Header=Silent Auction&EventID=" & EventID & "'," 
		Query =  Query &  " 'EventSilentAuction.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Silent Auction' ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"

		Conn.Execute(Query) 
		rs.close
	sql = "select PageLayoutID from EventPageLayout where EventID = " & EventID & " and LinkName='Silent Auction'"
		rs.Open sql, conn, 3, 3
 		PageLayoutID = rs("PageLayoutID")

		X = 0
		while X < 9
		 X = X + 1 
			Query =  "INSERT INTO EventPageLayout2 (EventID, BlockNum, PageLayoutID )" 
			Query =  Query & " Values (" &  EventID & ", " 
			Query =  Query &  " " &  X & ", " 
  			Query =  Query &  " " & PageLayoutID & " )" 
		Conn.Execute(Query) 
 		wend
	end if 

	rs.close
end if

'**************************************************************
' Check if the Event Home is listed in EventPageLayout
'**************************************************************
	sql = "select * from EventPageLayout where PageName = 'Event Home' and EventID = " & EventID
	rs.Open sql, conn, 3, 3
	If  rs.eof then
	
		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 1," 
		Query =  Query &  " 'Event Home'," 
 		Query =  Query &  " 'EditEventHome.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'EventHome.asp?EventID=" & EventID & "',"
		Query =  Query &  " 'Event Home'  ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"
		Conn.Execute(Query) 
	
	
	rs.close


	
		sql = "select PageLayoutID from EventPageLayout where EventID = " & EventID & " and LinkName='Event Home'"
		'response.write(sql)
		rs.Open sql, conn, 3, 3
 				PageLayoutID = rs("PageLayoutID")
		
		
		X = 0
		while X < 9
		 X = X + 1 
			Query =  "INSERT INTO EventPageLayout2 (EventID, BlockNum, PageLayoutID )" 
			Query =  Query & " Values (" &  EventID & ", " 
			Query =  Query &  " " &  X & ", " 
  			Query =  Query &  " " & PageLayoutID & " )" 

		
		'response.write(Query)	
		Conn.Execute(Query) 
		 		wend
	end if 
	rs.close


	'**************************************************************
	' Check if the Stud Auction is listed in EventPageLayout
	'**************************************************************
	
	'**************************************************************
	' Check if the Stud Auction is listed in EventPageLayout
	'**************************************************************
if StudAuctionAvailable = True then
	sql = "select * from EventPageLayout where PageName = 'Stud Auction' and EventID = " & EventID
	'response.write(sql)
	rs.Open sql, conn, 3, 3
	If  rs.eof then

		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 10," 
		Query =  Query &  " 'Stud Auction'," 
		Query =  Query &  " 'PageData2.asp?pagename=Stud Auction&Header=Stud Auction&EventID=" & EventID & "'," 
		Query =  Query &  " 'EventStudAuction.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Stud Auction' ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"
 
		'response.write(Query)	
		Conn.Execute(Query) 
		rs.close
		sql = "select PageLayoutID from EventPageLayout where EventID = " & EventID & " and LinkName='Stud Auction'"
		'response.write(sql)
		rs.Open sql, conn, 3, 3
 				PageLayoutID = rs("PageLayoutID")
		
		
		X = 0
		while X < 9
		 X = X + 1 
			Query =  "INSERT INTO EventPageLayout2 (EventID, BlockNum, PageLayoutID )" 
			Query =  Query & " Values (" &  EventID & ", " 
			Query =  Query &  " " &  X & ", " 
  			Query =  Query &  " " & PageLayoutID & " )" 

		
		'response.write(Query)	
		Conn.Execute(Query) 
 		wend
 		
	end if 

	rs.close
end if


	'**************************************************************
	' Check if the Forms is listed in EventPageLayout
	'**************************************************************


	sql = "select * from EventPageLayout where PageName = 'Forms' and EventID = " & EventID
	'response.write(sql)
	rs.Open sql, conn, 3, 3
	If  rs.eof then
	rs.close
		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 13," 
		Query =  Query &  " 'Forms'," 
		Query =  Query &  " 'Formsadmin.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'EventForms.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Forms' ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"
 
		'response.write(Query)	
		Conn.Execute(Query) 
		
		
		
		sql = "select PageLayoutID from EventPageLayout where EventID = " & EventID & " and LinkName='Forms'"
		'response.write(sql)
		rs.Open sql, conn, 3, 3
 				PageLayoutID = rs("PageLayoutID")
		
		
		X = 0
		while X < 9
		 X = X + 1 
			Query =  "INSERT INTO EventPageLayout2 (EventID, BlockNum, PageLayoutID )" 
			Query =  Query & " Values (" &  EventID & ", " 
			Query =  Query &  " " &  X & ", " 
  			Query =  Query &  " " & PageLayoutID & " )" 
 		
		
		'response.write(Query)	
		Conn.Execute(Query) 
		wend
	
	end if 
rs.close


	'**************************************************************
	' Check if the Advertising is listed in EventPageLayout
	'**************************************************************
if  AdvertisingAvailable = True then
	sql = "select * from EventPageLayout where PageName = 'Advertising' and EventID = " & EventID
	'response.write(sql)
	rs.Open sql, conn, 3, 3
	If  rs.eof then

		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 9," 
		Query =  Query &  " 'Advertising'," 
		Query =  Query &  " 'AdvertisingHome.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'EventAdvertising.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Advertising' ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"
 
		'response.write(Query)	
		Conn.Execute(Query) 
	
		
	end if 

	rs.close
end if




	'**************************************************************
	' Check if the Fleece is listed in EventPageLayout
	'**************************************************************
if FleeceShowAvailable = True then
	sql = "select * from EventPageLayout where PageName = 'Fleece Show' and EventID = " & EventID
	'response.write(sql)
	rs.Open sql, conn, 3, 3
	If  rs.eof then

		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 5," 
		Query =  Query &  " 'Fleece'," 
		Query =  Query &  " 'FleeceHome.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'EventFleece.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Fleece Show'  ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"
 
		'response.write(Query)	
		Conn.Execute(Query) 
	
	end if 
		rs.close


	'**************************************************************
	' Check if the Spin-off is listed in EventPageLayout
	'**************************************************************
	if SpinOffAvailable = True then
	sql = "select * from EventPageLayout where PageName = 'Spin-off' and EventID = " & EventID
	'response.write(sql)
	rs.Open sql, conn, 3, 3
	If  rs.eof then
		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 8," 
		Query =  Query &  " 'Spin-off'," 
		Query =  Query &  " 'SpinOffHome.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'EventSpin-off.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Spin-Off'  ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"

		'response.write(Query)	
		Conn.Execute(Query) 
	
	end if 
	rs.close
end if
end if
	


	'**************************************************************
	' Check if the Sponsors is listed in EventPageLayout
	'**************************************************************
if SponsorAvailable = True then
	sql = "select * from EventPageLayout where PageName = 'Sponsors' and EventID = " & EventID
	'response.write(sql)
	rs.Open sql, conn, 3, 3
	If  rs.eof then
		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 7," 
		Query =  Query &  " 'Sponsors'," 
		Query =  Query &  " 'SponsorsHome.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'EventSponsors.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Sponsors'  ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"
 
		'response.write(Query)	
		Conn.Execute(Query) 
	
	end if 
	rs.close
end if



	'**************************************************************
	' Check if the Fiber Arts Show is listed in EventPageLayout
	'**************************************************************
	sql = "select * from EventPageLayout where PageName = 'Fiber Arts Show' and EventID = " & EventID
	'response.write(sql)
	rs.Open sql, conn, 3, 3
	If  rs.eof then
		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 8," 
		Query =  Query &  " 'Fiber Arts Show'," 
		Query =  Query &  " 'PageData2.asp?pagename=Fiber Arts Show&EventID=" & EventID & "'," 
		Query =  Query &  " 'EventFiberArtsShow.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Fiber Arts Show'  ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"
 
		'response.write(Query)	
		Conn.Execute(Query) 


	rs.close


	
		sql = "select PageLayoutID from EventPageLayout where EventID = " & EventID & " and PageName='Fiber Arts Show'"
		'response.write(sql)
		rs.Open sql, conn, 3, 3
 				PageLayoutID = rs("PageLayoutID")
		
		
		X = 0
		while X < 9
		 X = X + 1 
			Query =  "INSERT INTO EventPageLayout2 (EventID, BlockNum, PageLayoutID )" 
			Query =  Query & " Values (" &  EventID & ", " 
			Query =  Query &  " " &  X & ", " 
  			Query =  Query &  " " & PageLayoutID & " )" 

		
		

		'response.write(Query)	
		Conn.Execute(Query)
		 		wend
	end if 
	rs.close



	'**************************************************************
	' Check if the Judges is listed in EventPageLayout
	'**************************************************************
if JudgesAvailable = True then
	sql = "select * from EventPageLayout where PageName = 'Judges' and EventID = " & EventID
	'response.write(sql)
	rs.Open sql, conn, 3, 3
	If  rs.eof then
	
		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 9," 
		Query =  Query &  " 'Judges'," 
 		Query =  Query &  " 'JudgesHome.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'EventJudges.asp?EventID=" & EventID & "',"
		Query =  Query &  " 'Judges'  ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"

		'response.write(Query)	
		Conn.Execute(Query) 
	
	
	rs.close


	
		sql = "select PageLayoutID from EventPageLayout where EventID = " & EventID & " and LinkName='Judges'"
		'response.write(sql)
		rs.Open sql, conn, 3, 3
 				PageLayoutID = rs("PageLayoutID")
		
		
		X = 0
		while X < 9
		 X = X + 1 
			Query =  "INSERT INTO EventPageLayout2 (EventID, BlockNum, PageLayoutID )" 
			Query =  Query & " Values (" &  EventID & ", " 
			Query =  Query &  " " &  X & ", " 
  			Query =  Query &  " " & PageLayoutID & " )" 

		
		'response.write(Query)	
		Conn.Execute(Query) 
		 		wend
	end if 
	rs.close
end if

	'**************************************************************
	' Check if the Vendors is listed in EventPageLayout
	'**************************************************************
if VendorsAvailable = True then
	sql = "select * from EventPageLayout where PageName = 'Vendors' and EventID = " & EventID
	'response.write(sql)
	rs.Open sql, conn, 3, 3
	If  rs.eof then
		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 9," 
		Query =  Query &  " 'Vendors'," 
		Query =  Query &  " 'VendorsHome.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'EventVendors.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Vendors'  ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"
		'response.write(Query)	
		Conn.Execute(Query) 
	
	end if 
	rs.close
end if


	'**************************************************************
	' Check if the Classes is listed in EventPageLayout
	'**************************************************************
if  ClassesAvailable = True then
	sql = "select * from EventPageLayout where PageName = 'Classes' and EventID = " & EventID
	'response.write(sql)
	rs.Open sql, conn, 3, 3
	If  rs.eof then
		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 11," 
		Query =  Query &  " 'Classes'," 
		Query =  Query &  " 'ClassesHome.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'EventClasses.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Classes'  ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"
		'response.write(Query)	
		Conn.Execute(Query) 
	
	end if 
	rs.close

end if

	


	'**************************************************************
	' Check if the Photo Contest is listed in EventPageLayout
	'**************************************************************
	sql = "select * from EventPageLayout where PageName = 'Photo Contest' and EventID = " & EventID
	'response.write(sql)
	rs.Open sql, conn, 3, 3
	If  rs.eof then
	rs.close
		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 11," 
		Query =  Query &  " 'Photo Contest'," 
		Query =  Query &  " 'PageData2.asp?pagename=Photo Contest&EventID=" & EventID & "'," 
		Query =  Query &  " 'EventPhotoContest.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Photo Contest'  ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"

		'response.write(Query)	
		Conn.Execute(Query) 

	
		sql = "select PageLayoutID from EventPageLayout where EventID = " & EventID & " and LinkName='Photo Contest'"
		'response.write(sql)
		rs.Open sql, conn, 3, 3
 				PageLayoutID = rs("PageLayoutID")
		
		
		X = 0
		while X < 9
		 X = X + 1 
			Query =  "INSERT INTO EventPageLayout2 (EventID, BlockNum, PageLayoutID )" 
			Query =  Query & " Values (" &  EventID & ", " 
			Query =  Query &  " " &  X & ", " 
  			Query =  Query &  " " & PageLayoutID & " )" 

		
		'response.write(Query)	
		Conn.Execute(Query) 
		 		wend
	end if 
	rs.close



'**************************************************************
' Check if the Dinner is listed in EventPageLayout
'**************************************************************
if DinnerAvailable = true then
	sql = "select * from EventPageLayout where PageName = 'Dinner' and EventID = " & EventID
	'response.write(sql)
	rs.Open sql, conn, 3, 3
	If  rs.eof then
	rs.close
		Query =  "INSERT INTO EventPageLayout (EventID, LinkOrder, Linkname, Editlink, FileName, PageName, PageAvailable, ShowPage )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 12," 
		Query =  Query &  " 'Dinner'," 
		Query =  Query &  " 'DinnerHome.asp?pagename=Dinner&EventID=" & EventID & "'," 
		Query =  Query &  " 'EventDinner.asp?EventID=" & EventID & "'," 
		Query =  Query &  " 'Dinner'  ," 
		Query =  Query &  " Yes ,"
		Query =  Query &  " Yes )"
 
		'response.write(Query)	
		Conn.Execute(Query) 
	


	
		sql = "select PageLayoutID from EventPageLayout where EventID = " & EventID & " and LinkName='Dinner'"
		'response.write(sql)
		rs.Open sql, conn, 3, 3
 				PageLayoutID = rs("PageLayoutID")
		
		
		X = 0
		while X < 9
		 X = X + 1 
			Query =  "INSERT INTO EventPageLayout2 (EventID, BlockNum, PageLayoutID )" 
			Query =  Query & " Values (" &  EventID & ", " 
			Query =  Query &  " " &  X & ", " 
  			Query =  Query &  " " & PageLayoutID & " )" 

		
		'response.write(Query)	
		Conn.Execute(Query) 
		 		wend
		 		
		 		
		 		
		Query =  "INSERT INTO ExtraOptions (EventID, OptionType, ExtraOptionsName )" 
		Query =  Query & " Values (" &  EventID  & ", "
		Query =  Query &  " 'Dinner'," 
		Query =  Query &  " 'Free Dinner Ticket(s)' )"
 
		'response.write(Query)	
		Conn.Execute(Query) 

	end if 
	rs.close

	
End if 



response.redirect("RegManageHome.asp?EventID=" & EventID )
%>	

		</Body>
</HTML>


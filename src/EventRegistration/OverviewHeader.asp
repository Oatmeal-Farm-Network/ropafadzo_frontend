<% 
if len(EventID) > 0 then
	Session("EventID") = EventID
else
	EventID = Session("EventID") 
end if 
if len(EventTypeID) > 0 then
else
EventTypeID = request.querystring("EventTypeID")
end if

if len(EventID) > 0 then
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
  end if
    
sql = "select ServiceType from ServiceTypeLookup, services where services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and  EventID = " & EventID  

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
while Not rs.eof 


 if rs("ServiceType") = "Halter Show" then
    ShowHalterShow = True 
End If

 if rs("ServiceType")  = "Fleece Show" then
   ShowFleeceShow = True 
End If
    
      
if rs("ServiceType")  = "SpinOff" then
   ShowSpinOff = True 
End If

 if rs("ServiceType")  = "Advertising" then
     AdvertisingShow = True 
End If

if tempservicetype = "Stud Auction" then
      ShowStudauction = True 
End If


 if rs("ServiceType")  = "Vendors" then
       ShowVendors = True 
     End If

 if rs("ServiceType")  = "Sponsor" then
       ShowSponsors = True 
     End If

 if rs("ServiceType")  = "Classes / Workshops" then
       ShowClasses = True 
     End If

   if rs("ServiceType")  = "Dinner" then
       ShowDinner = True 
     End If


 if rs("ServiceType")  = "Silent Auction" then
       ShowSilentauction = True 
     End If

rs.movenext
wend
rs.close
end if
    
     %>


<!--#Include file="HeaderTabsInclude.asp"--> 
<table cellpadding = "1" cellspacing = "0" border = "0" width = "<%=screenwidth%>" height = "34" bgcolor = " #065906" >
<tr><td ><img src = "images/px.gif" width = "20" height = "1" >
<% if len(EventID) > 0  and not (Current = "DeleteEvents")  then %>
	 <a href = "RegManageHome.asp?EventID=<%=EventID%>" class = "menu2">Event Overview</a> | 
	 <a href = "EditEvent.asp?EventID=<%=EventID%>" class = "menu2">Event Facts</a> | 
<% end if %>
	 </td>
	 <td align = "right">
	 	<a href = "RegHome.asp?PeopleID=<%=PeopleID%>" class = "menu2">List of Your Events</a>
<% if len(EventID) > 0  and not (Current = "DeleteEvents")  then %>
 | <a href = "EditEvent.asp?EventID=<%=EventID%>" class = "menu2">Your Information</a><% end if %><img src = "images/px.gif" width = "5" height = "1">
</td></tr></table>
 <!--#Include file="HeaderTabsIncludeBottom.asp"-->
 <h1><%=EventName%></h1>
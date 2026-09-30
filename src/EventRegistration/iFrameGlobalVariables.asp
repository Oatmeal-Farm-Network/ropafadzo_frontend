<% 
 

'response.Write("EventID1=" & EventID )
  if len(EventID) < 1 then
  EventID = request.QueryString("EventID")
  end if
  'response.Write("EventIDqs=" & EventID )
    if len(EventID) < 1 then
  EventID = session("EventID")
  end if
  'response.Write("EventIDsession=" & EventID )
  
  if len(EventID) < 1 then
   EventID = request.Cookies("EventID")
  end if
  'response.Write("EventIDcookie=" & EventID )
  
  if len(EventID) > 0 then
    response.Cookies("EventID") = EventID
    Session("EventID") = EventID
  end if 
'response.Write("EventID=" & EventID )
backgroundcolor = "white"

AdministrationPath = "/Administration"
WebSiteName = "Andresen Events"
PhysicalPath = "e:\inetpub\wwwroot\Internet-host\johnandmom\andresenevents.com\www\"
Slogan = ""
BorderColor = "#ebebeb"
Style = "Style.css"
Showsearch = True

'**************************************************************
 ' Hard Coded Variables
'**************************************************************
Slogan = ""
BorderColor = "#ebebeb"
URL = "http://www.AndresenEvents.com"
DatabasePath = "../DB/AndresenEvents.mdb"

'**************************************************************
 ' Hard Coded Variables
'**************************************************************
DSN_Name = "AEDB2"
DSN_Name = "MasterDB"

'**************************************************************
 ' Define Conn Object
'**************************************************************
Set Conn = Server.CreateObject("ADODB.Connection") 
Conn.Open "DSN=" & DSN_Name & ";UID=admin;PWD=Chickens"
Set rs = Server.CreateObject("ADODB.Recordset")

'**************************************************************
 ' Open RecordSet For Page Info
'**************************************************************
sql = "select * from Sitedesign "
rs.Open sql, conn, 3, 3
If Not rs.eof then
'**************************************************************
 ' Gather List of Pages
'**************************************************************
LayoutStyle = rs("LayoutStyle")
PageAlign = rs("PageAlign")
PageWidth = rs("PageWidth")
PageBorder = rs("PageBorder")
PageBorderColor = rs("PageBorderColor")

PageColor = rs("ScreenBackgroundColor")
Header = rs("Header")
PageBackgroundColor = rs("PageBackgroundColor")
PageBackgroundImage = rs("PageBackgroundImage")
ScreenBackgroundImage = rs("ScreenBackgroundImage")

FooterImage = rs("FooterImage")
Logo = rs("Logo")
TitleColor = rs("TitleColor")
TitleFont = rs("TitleFont")
TitleSize = rs("TitleSize")
TitleAlign = rs("TitleAlign")
TitleWeight = rs("TitleWeight")
TitleItalics = rs("TitleItalics")

MenuBackgroundColor = rs("MenuBackgroundColor")
MenuBackgroundImage = rs("MenuBackgroundImage")
MenuColor = rs("MenuColor")
MenuSize = rs("MenuSize")
MenuFont = rs("MenuFont")
MenuFontMouseOverColor = rs("MenuFontMouseOverColor")
MenuAlign = rs("MenuAlign")
MenuWeight = rs("MenuWeight")
MenuItalics = rs("MenuItalics")

PageTextFont = rs("PageTextFont")
PageTextColor = rs("PageTextColor")
PageTextFontSize = rs("PageTextFontSize")
PageTextHyperlinkColor = rs("PageTextHyperlinkColor")
PageTextMouseOverColor = rs("PageTextMouseOverColor")
PageTextAlign = rs("PageTextAlign")
PageTextWeight = rs("PageTextWeight")
PageTextItalics = rs("PageTextItalics")

H2Font = rs("H2Font")
H2Color = rs("H2Color")
H2Size = rs("H2Size")
H2HyperlinkColor = rs("H2HyperlinkColor")
H2MouseOverColor = rs("H2MouseOverColor")
H2Align = rs("H2Align")
H2Weight = rs("H2Weight")
H2Italics = rs("H2Italics")

H3Font = rs("H3Font")
H3Color = rs("H3Color")
H3Size = rs("H3Size")
H3HyperlinkColor = rs("H3HyperlinkColor")
H3MouseOverColor = rs("H3MouseOverColor")
H3Align = rs("H3Align")
H3Weight = rs("H3Weight")
H3Italics = rs("H3Italics")

H4Font = rs("H4Font")
H4Color = rs("H4Color")
H4Size = rs("H4Size")
H4HyperlinkColor = rs("H4HyperlinkColor")
H4MouseOverColor = rs("H4MouseOverColor")
H4Align = rs("H4Align")
H4Weight = rs("H4Weight")
H4Italics = rs("H4Italics")

FooterColor = rs("FooterColor")
FooterTextColor = rs("FooterTextColor")
FooterTextSize = rs("FooterTextSize")
FooterTextFont = rs("FooterTextFont")
FooterHyperlinkColor = rs("FooterHyperlinkColor")
FooterMouseOverColor = rs("FooterMouseOverColor")
FooterAlign = rs("FooterAlign")
FooterWeight = rs("FooterWeight")
FooterItalics = rs("FooterItalics")
FooterImage = rs("FooterImage")

if LayoutStyle = "Landscape" then
	PageWidth = 980
	TextWidth = PageWidth - 20 
End if 

if LayoutStyle = "Portrait" or LayoutStyle = "Portrait2" then
	PageWidth = PageWidth
	TextWidth = PageWidth -210 
End if 

tempfont = FooterTextFont %>
   <!--#Include file="ConvertFontInclude.asp"--> 

<% tempfont = TitleFont %>
   <!--#Include file="ConvertFontInclude.asp"--> 
   
<% TitleFont = tempfont	
					
tempfont = MenuFont %>
   <!--#Include file="ConvertFontInclude.asp"--> 
   
<% MenuFont = tempfont	

tempfont = PageTextFont %>
   <!--#Include file="ConvertFontInclude.asp"--> 
   
<% PageTextFont = tempfont	

					
'**************************************************************
 ' Style
'**************************************************************

End If 
'**************************************************************
' Close RecordSet
'**************************************************************
Rs.close

'**************************************************************
' Get Links
'**************************************************************
dim PageNameArray(100)
dim FileNameArray(100)

sql = "select Linkname, FileName from PageLayout where PageAvailable = True and not linkorder = 8 order by LinkOrder" 
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
x=1
while not rs.eof	
	PageNameArray(x) = rs("Linkname")
	FileNameArray(x) = rs("FileName")
	x = x + 1
	rs.movenext
wend
totalpages = x -1
				
'**************************************************************
' Close RecordSet
'**************************************************************
Rs.close

'**************************************************************
' Open RecordSet For Page Info
'**************************************************************
sql = "select * from pageLayout where PageName = '" & PageName & "';"
rs.Open sql, conn, 3, 3
If Not rs.eof then
'**************************************************************
' Gather List of Pages
'**************************************************************
PageText = rs("PageText")
PageTitle = rs("PageTitle")
PageHeading1= rs("PageHeading1")
PageHeading2= rs("PageHeading2")
PageHeading3= rs("PageHeading3")
PageHeading4= rs("PageHeading4")
								
PageText1 = rs("PageText1")
PageText2 = rs("PageText2")
PageText3 = rs("PageText3")
PageText4 = rs("PageText4")
					
Image1= rs("Image1")
Image2= rs("Image2")
Image3= rs("Image3")
Image4= rs("Image4")

ImageCaption1= rs("ImageCaption1")
ImageCaption2= rs("ImageCaption2")
ImageCaption3= rs("ImageCaption3")
ImageCaption4= rs("ImageCaption4")

ImageOrientation1= rs("ImageOrientation1")
ImageOrientation2= rs("ImageOrientation2")
ImageOrientation3= rs("ImageOrientation3")
ImageOrientation4= rs("ImageOrientation4")
'	FeaturedID= rs("FeaturedID")
'	FeaturedStudID= rs("FeaturedStudID")

End If 
'**************************************************************
' Close RecordSet
'**************************************************************
Rs.close
AdvertisingAvailable = False
ClassesAvailable = False
DinnerAvailable = False
FleeceShowAvailable = False
HalterShowAvailable = False
SilentAuctionAvailable = False
SpinOffAvailable = False
SponsorAvailable = False
StudAuctionAvailable = False     
VendorsAvailable = False
JudgesAvailable = False

if len(EventID) > 0 then

sql = "select EventTypeID from Event where  EventID = " & EventID
	rs.Open sql, conn, 3, 3
	If not rs.eof then
         EventTypeID = rs("EventTypeID")
    end if
    rs.close
  
if len(EventTypeID ) > 0 then
sql = "select * from ServiceTypeLookup where ServiceType = 'Advertising' and Available= true and EventTypeID = " & EventTypeID
	rs.Open sql, conn, 3, 3
	If not rs.eof then
        AdvertisingAvailable = True
    end if
    rs.close
 	

sql = "select * from ServiceTypeLookup where ServiceType = 'Judges' and Available= true and EventTypeID = " & EventTypeID
	rs.Open sql, conn, 3, 3
	If not rs.eof then
        JudgesAvailable = True
    end if
    rs.close
    
 	
sql = "select * from ServiceTypeLookup where ServiceType = 'Classes / Workshops' and Available= true and EventTypeID = " & EventTypeID
	rs.Open sql, conn, 3, 3
	If not rs.eof then
        ClassesAvailable = True
    end if
    rs.close
 
sql = "select * from ServiceTypeLookup where ServiceType = 'Dinner' and Available= true and EventTypeID = " & EventTypeID
	rs.Open sql, conn, 3, 3
	If not rs.eof then
       DinnerAvailable = True
    end if
    rs.close
 
sql = "select * from ServiceTypeLookup where ServiceType = 'Fleece Show' and Available= true and EventTypeID = " & EventTypeID
	rs.Open sql, conn, 3, 3
	If not rs.eof then
       FleeceShowAvailable = True
    end if
    rs.close
 
sql = "select * from ServiceTypeLookup where ServiceType = 'Halter Show' and Available= true and EventTypeID = " & EventTypeID
	rs.Open sql, conn, 3, 3
	If not rs.eof then
       HalterShowAvailable = True
    end if
    rs.close
    	
sql = "select * from ServiceTypeLookup where ServiceType = 'Silent Auction' and Available= true and EventTypeID = " & EventTypeID
	rs.Open sql, conn, 3, 3
	If not rs.eof then
       SilentAuctionAvailable = True
    end if
    rs.close
    
sql = "select * from ServiceTypeLookup where ServiceType = 'SpinOff' and Available= true and EventTypeID = " & EventTypeID
	rs.Open sql, conn, 3, 3
	If not rs.eof then
       SpinOffAvailable = True
    end if
    rs.close
             
  
sql = "select * from ServiceTypeLookup where ServiceType = 'Sponsor' and Available= true and EventTypeID = " & EventTypeID
	rs.Open sql, conn, 3, 3
	If not rs.eof then
       SponsorAvailable = True
    end if
    rs.close
    
sql = "select * from ServiceTypeLookup where ServiceType = 'Stud Auction' and Available= true and EventTypeID = " & EventTypeID
	rs.Open sql, conn, 3, 3
	If not rs.eof then
       StudAuctionAvailable = True
    end if
    rs.close
        
sql = "select * from ServiceTypeLookup where ServiceType = 'Vendors' and Available= true and EventTypeID = " & EventTypeID
	rs.Open sql, conn, 3, 3
	If not rs.eof then
       VendorsAvailable = True
    end if
    rs.close
 end if   
     
       
	'**************************************************************
	' Check if the event is listed in EventSiteDesign 
	'**************************************************************
	sql = "select * from EventSiteDesign where EventID = " & EventID
	rs.Open sql, conn, 3, 3
	If rs.eof then
	
		Query =  "INSERT INTO EventSiteDesign (EventID)" 
		Query =  Query & " Values (" &  EventID  & ")"
		Conn.Execute(Query) 
		
		Query =  "INSERT INTO EventSiteDesigntemp (EventID)" 
		Query =  Query & " Values (" &  EventID  & ")"
		Conn.Execute(Query) 
end if 
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
	sql = "select * from EventPageLayout where PageName = 'Vet Check' and EventID = " & EventID
	rs.Open sql, conn, 3, 3
	If  rs.eof then
	rs.close
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
	rs.close
	
	
	
		
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
end if


'**************************************************************
' Open RecordSet From sfCustomer
'**************************************************************
sql = "select * from AndresenEvents where CustID = 66;"
'response.write(sql)
rs.Open sql, conn, 3, 3
If Not rs.eof then
FavIcon= rs("FavIcon")
FavIconShortcut= rs("FavIconShortcut")
UploadPath = rs("UploadPath")
end if 




'**************************************************************
' Close RecordSet
'**************************************************************
Rs.close
'response.write("B DatabasePath = " & DatabasePath & "<br/>")

if len(EventID) > 0 then
 
sqlA =  "Select * from PaymentOptions where EventID= " & EventID & " order by  PaymentOptionsID DESC "
Set rsA = Server.CreateObject("ADODB.Recordset")
'response.write("SqlA = " & sqlA & "<br/>")
rsA.Open sqlA, conn, 3, 3 
	
if Not rsA.eof  Then

   Checks  = rsA("Checks")
   Paypal  = rsA("Paypal")
   PaypalEmail = rsA("PaypalEmail")
   Checkaddress = rsA("Checkaddress")
   PaymentName = rsA("PaymentName")
   PaymentStreet = rsA("PaymentStreet")
   PaymentStreet2 = rsA("PaymentStreet2")
   PaymentCity = rsA("PaymentCity")
   PaymentState = rsA("PaymentState")
   PaymentZip= rsA("PaymentZip")
   PaymentOptionsID = rsA("PaymentOptionsID")
   PaymentCountry = rsA("PaymentCountry")
   
end if
rsA.close

ReadytoReceivePayments = False
if (len(Checks) > 0 and len(Checkaddress) > 0  and len(CheckCity) > 0 and len(CheckState) > 0 and len(PaymentName) > 0) or (len(Paypal) and len(PaypalEmail) > 0) then
   ReadytoReceivePayments = True
end if 


sqlA =  "Select * from Event where EventID= " & EventID 
Set rsA = Server.CreateObject("ADODB.Recordset")
'response.write("SqlA = " & sqlA & "<br/>")
rsA.Open sqlA, conn, 3, 3 
	
if Not rsA.eof  Then
   EventStatus= rsA("EventStatus")
    EventStartMonth = rsA("EventStartMonth")
	EventStartDay = rsA("EventStartDay")
	EventStartYear = rsA("EventStartYear")
	EventEndMonth = rsA("EventEndMonth")
	EventEndDay = rsA("EventEndDay")
	EventEndYear = rsA("EventEndYear")
	EventStartDate =EventStartMonth & "/" & EventStartDay & "/" & EventStartYear
	EventEndDate = EventEndMonth & "/" & EventEndDay & "/" & EventEndYear
end if
rsA.close

PastEventStart = False
if DateDiff("d",EventStartDate,now) > -1 then
PastEventStart = True
end if

'response.Write("DateDiff(d,EventStartDate,now)= " & DateDiff("d",EventStartDate,now) )
BeforeEventEnd = False
if DateDiff("d", now , EventEndDate) > -1 then
BeforeEventEnd = True
end if


ShowRegistration = False
if PastEventStart = True and BeforeEventEnd = True and EventStatus="Published" and ReadytoReceivePayments= True then
ShowRegistration = True
end if 
end if
'response.Write("PastEventStart=" & PastEventStart & "<br>")
'response.Write("BeforeEventEnd=" & BeforeEventEnd & "<br>")
'response.Write("ReadytoReceivePayments=" & ReadytoReceivePayments & "<br>")
'response.Write("EventStatus=" & EventStatus & "<br>")
'response.Write("ShowRegistration=" & ShowRegistration & "<br>")

'if not EventStatus= "Published" then
  'response.Redirect("Default.asp")
'end if 
%>


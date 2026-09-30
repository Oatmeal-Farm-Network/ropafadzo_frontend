
<%

dim EventID, PeopleID
sDate = Now()
sNewDate = DateAdd("yyyy", 2, sDate)

if len(Request.Cookies("PeopleFirstName") ) > 1 then
    Session("PeopleFirstName") = Request.Cookies("PeopleFirstName") 
end if

PeopleID = request.querystring("PeopleID")

if len(PeopleID) > 0 then
Session("PeopleID") = PeopleID
else
    if len(session("PeopleID")) > 0 then
    response.Cookies("PeopleID") = PeopleID
    Response.Cookies("PeopleID").Expires=sNewDate
    PeopleID = Session("PeopleID")
    end if
end if 

if len(PeopleID) > 0 then
    response.Cookies("LoggedIn") = True
     Response.Cookies("LoggedIn").Expires=sNewDate
end if 

if Request.Cookies("LoggedIn") = True then
    Session("LoggedIn") = Request.Cookies("LoggedIn")
end if


if len(PeopleID) < 1 then
   PeopleID = Request.querystring("PeopleID")
       response.Cookies("PeopleID") = PeopleID
     Response.Cookies("PeopleID").Expires=sNewDate
       response.Cookies("LoggedIn") = True
     Response.Cookies("LoggedIn").Expires=sNewDate
end if


  EventID = request.QueryString("EventID")
  if len(EventID) < 1 then
   EventID = Session("EventID")
  end if

  if len(EventID) < 1 then
   EventID = request.Cookies("EventID")
  end if

  if len(EventID) > 0 then
    response.Cookies("EventID") = EventID
    Session("EventID") = EventID
  end if 

'if len(PeopleID) < 1 then
'response.Redirect("Default.asp")'
'end if

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
DSN_Name = "MasterDB"
'**************************************************************
 ' Define Conn Object
'**************************************************************
Set Conn = Server.CreateObject("ADODB.Connection") 
Conn.Open "DSN=" & DSN_Name & ";UID=Test;PWD=Test"
				
						
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

sql = "select Linkname, FileName from PageLayout where PageAvailable = True  and not linkorder = 8 order by LinkOrder"	
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

End If 
'**************************************************************
' Close RecordSet
'**************************************************************
Rs.close


'**************************************************************
' Open RecordSet From sfCustomer
'**************************************************************
sql = "select * from AndresenEvents where CustID = 66;"
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

'**************************************************************
' Open RecordSet From sfCustomer
'**************************************************************
if len(EventID) > 0 then
sql = "select * from Event where EventID =" & EventID
rs.Open sql, conn, 3, 3
If Not rs.eof then
EventName= rs("EventName")
EventDescription= rs("EventDescription")
end if

'**************************************************************
' Close RecordSet
'**************************************************************
Rs.close
end if
If len(EventID) > 0 then

sqlA =  "Select * from PaymentOptions where EventID= " & EventID & " order by  PaymentOptionsID DESC "
Set rsA = Server.CreateObject("ADODB.Recordset")

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
if (len(Checks) > 0 and len(Checkaddress) > 0  and len(CheckCity) > 0 and len(CheckState) > 0 and len(PaymentName) > 0) or (len(Paypal) and len(PaypalEmail)) > 0 then
   ReadytoReceivePayments = True
end if 


sqlA =  "Select * from Event where EventID= " & EventID 
Set rsA = Server.CreateObject("ADODB.Recordset")
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
if len(EventStartDate) > 2 then
if DateDiff("d",EventStartDate,now) > 0 then
PastEventStart = True
end if
end if

BeforeEventEnd = False
if len(EventEndMonth) > 0 and len(EventEndDay) > 0 and len(EventEndYear) > 0 then
'response.Write("EventEnddate =" &  cdate(EventEnddate) )

'tempeventenddate = EventEndMonth & "/" & EventEndDay & "/" & EventEndYear
'if DateDiff("d", Now , tempeventenddate ) > 0 then
BeforeEventEnd = True
'end if
end if

ShowRegistration = False
if PastEventStart = True and BeforeEventEnd = True and EventStatus="Published" and ReadytoReceivePayments= True then
ShowRegistration = True
end if 

'response.Write("PastEventStart=" & PastEventStart & "<br>")
'response.Write("BeforeEventEnd=" & BeforeEventEnd & "<br>")
'response.Write("ReadytoReceivePayments=" & ReadytoReceivePayments & "<br>")
'response.Write("EventStatus=" & EventStatus & "<br>")
'response.Write("ShowRegistration=" & ShowRegistration & "<br>")
end if

%>
  <!--#Include file="MobileWidthInclude.asp"-->
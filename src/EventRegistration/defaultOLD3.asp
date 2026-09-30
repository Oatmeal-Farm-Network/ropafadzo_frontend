<%@ Language="VBScript" %> 
<html>
<head>
<title>Alpaca Event Registration at Andresen Events</title>
<META name="Title" content="Alpaca Event Registration at Andresen Events">
<META name="description" content="Alpaca Event Registration at Andresen Events">
<META name="keywords" content="Alpaca events, livestock events, events,Alpaca event registration, Livestock event registration, online registration, event registration, online event registration, event registration software, event registration online, online event registration software, event registration management software, event registration system, event management, registration software, event registration service, event registration services, easy online event registration, online event registration service, event registration website, event registration site, online event registration services,  PayPal, credit cards, online payments"> 
<meta name="robots" content="index,follow">
<meta name="rating" content="Safe for kids">
<meta name="revisit-after" content="1">
<meta name="Googlebot" content="index,follow">
<meta name="robots" content="All">
<meta name="subjects" content="Event Registration, Alpaca Events" >
<link rel="shortcut icon" href="/AELogo.ico" > 
<link rel="icon" href="http://www.AndresenEvents.com/AELogo.ico" > 
<meta name="author" content="The Andresen group">
<link rel="stylesheet" type="text/css" href="Style.css">


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">







<%
sDate = Now()
sNewDate = DateAdd("yyyy", 2, sDate)

if len(Request.Cookies("PeopleFirstName") ) > 1 then
    Session("PeopleFirstName") = Request.Cookies("PeopleFirstName") 
end if

PeopleID = request.Cookies("PeopleID")

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
DSN_Name = "AEDB"


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
%>






















	
	<% if len(PeopleID) > 0 then
	'response.redirect("Defaulttest.asp") 
	end if %>
<table   border="0" cellspacing="0" cellpadding="0"   align = "center"  valign ="top"   width = "800" bgcolor = "white" >
	<tr>
	<td class = "body" width = "800" height = "300"  valign = "top" align = "center" colspan = "5"> 
		<center><br><br><br><h1>Coming Soon!</h1>
		<img src = "/images/AELogo.jpg" height= "231" width = "400" border = "0" align = "center" alt="Event Registration - Andresen Events"></center>

</td>
</tr>
		
<tr><td class="body" colspan = "5"><br><br>&nbsp;&nbsp;&nbsp;Andresen Events is part of the <b>Andresen Family of Websites</b>:</td></tr> 
<tr><td><a href = "http://www.TheAndresenGroup.com" class = "body" target = "blank"><img src= "http://www.TheAndresenGroup.com/AndresenLogos/AndresenGroupLogoPortrait.jpg" width = "140" border = "0" alt = "Web development and Marketing"></a></td>

<td width = "180"><a href = "http://www.AlpacaInfinity.com" class = "body" target = "blank"><img src= "http://www.TheAndresenGroup.com/AndresenLogos/AlpacaInfinity.jpg" width = "160" border = "0" alt = "Alpacas for Sale from Alpaca ranches all Over America"></a></td>
<td><a href = "http://www.AndresenAcres.com" class = "body" target = "blank"><img src= "http://www.TheAndresenGroup.com/AndresenLogos/AndresenAcresLogo.jpg" width = "160" border = "0" alt = "Alpacas for Sale in Southern Oregon"></a></td>
<td><a href = "http://www.LivestockofAmerica.com" class = "body" target = "blank"><img src= "http://www.TheAndresenGroup.com/AndresenLogos/LivestockofAmericaLogo.png" width = "160" border = "0"  alt = "Livestock For Sale - Horses, Alpacas, Llamas, Sheep, Goats, Swine, Bison, & Cattle"></a></td>
<td><a href = "http://www.AndresenEvents.com" class = "body" target = "blank"><img src= "http://www.TheAndresenGroup.com/AndresenLogos/AELogo.jpg" width = "160" border = "0" alt = "Event Registration for Livestock Shows"></a></td>

</tr>
</table>

<table   border="0" cellspacing="0" cellpadding="0"   align = "center"  valign ="top"   width = "800"  >
	<tr>
	   <td class="copyright">
		&copy;The ANDRESEN<b>GROUP</b> 2001 - <%=Year(now)%>,  All Rights Reserved.
	   </td>
       </tr>
</table> 

</body>
</html>
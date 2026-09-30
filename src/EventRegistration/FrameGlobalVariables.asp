<!--#Include virtual="/Conn.asp"-->
<% 'Global Variables
Dim DatabasePath
Dim AdministrationPath
Dim WebSiteName
Dim Slogan
Dim Breed
Dim PhysicalPath
Dim BorderColor
Dim BackgroundColor
Dim style
Dim ScreenBackgroundColor
'**************************************************************
 ' Gather List of Pages
'**************************************************************
EventID = Session("EventID")

  sql = "select * from EventSiteDesigntemp where EventID =  " & EventID
'response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 
    
if rs.eof then

    	Query =  "INSERT INTO EventSiteDesigntemp (EventID)" 
		Query =  Query & " Values (" &  EventID  & ")"
		'response.write(Query)	
		Conn.Execute(Query) 


		sql = "select * from EventSiteDesigntemp where EventID= " & EventID
		'response.write(sql)
		
		Set rs = Server.CreateObject("ADODB.Recordset")
   		rs.Open sql, conn, 3, 3   
		Header = rs("Header")
		logo = rs("Logo")
		sql = "select * from EventSiteDesigntemp where custid=66 "
'response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 

end if


  
Header = rs("Header")
logo = rs("Logo")

LayoutStyle = rs("LayoutStyle")
Pagewidth = rs("Pagewidth")
MenuBackgroundColor = rs("MenuBackgroundColor")
MenuBackgroundImage = rs("MenuBackgroundImage")
PageBackgroundColor = rs("PageBackgroundColor")
PageBackgroundImage = rs("PageBackgroundImage")
ScreenBackgroundColor = rs("ScreenBackgroundColor")
ScreenBackgroundImage = rs("ScreenBackgroundImage")
AnimalListbackgroundColor = rs("AnimalListbackgroundColor")
AnimalListbackgroundColor = rs("AnimalListbackgroundImage")
MenuColor = rs("MenuColor")
FooterColor = rs("FooterColor")
FooterImage = rs("FooterImage")
PageAlign = rs("PageAlign")
PageBorder = rs("PageBorder")
PageBorderColor = rs("PageBorderColor")
PageWidth = rs("PageWidth")

rColor = DBPageBorderColor	
if LayoutStyle = "Landscape" then
	PageWidth = PageWidth/2
	TextWidth = PageWidth - 10 
End if 

if LayoutStyle = "Portrait" or LayoutStyle = "Portrait2" then
	PageWidth = PageWidth/2
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
%>
<style>

	BODY {background: <%=ScreenBackgroundColor %>; 	background-image : url(<%=ScreenBackgroundImage %>);}
	
		.footer {font: <%=FooterTextSize%>pt <%=FooterTextFont %>; font-weight:  <%=FooterWeight %> ;  <% if FooterItalics = "Yes" then %> font-style: italic;<% end if %> color: <%=FooterTextColor%> ; text-align: <%=FooterAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize +2 %>px; PADDING-TOP: 0px; }
		A.footer {font: <%=FooterTextSize%>pt <%=FooterTextFont%>; font-weight:  <%=FooterWeight %> ;  <% if FooterItalics = "Yes" then %> font-style: italic;<% end if %> color: <%=FooterHyperlinkColor %>; text-decoration :none; text-align: <%=FooterAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=FooterTextSize +2 %>px; PADDING-TOP: 0px; }
		A.footer:hover {font: <%=FooterTextSize%>pt <%=FooterTextFont%>; color: <%=FooterMouseOverColor%> ; text-decoration :none; font-weight:  <%=FooterWeight %> ;  <% if FooterItalics = "Yes" then %> font-style: italic;<% end if %>  text-align: <%=FooterAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=FooterTextSize +2 %>px; PADDING-TOP: 0px; }




		H1 {font: <%=TitleSize - 20 %>pt <%=TitleFont %>; font-weight:  <%=TitleWeight %> ;  <% if TitleItalics = "Yes" then %> font-style: italic;<% end if %> color: <%=TitleColor %>; text-align: <%=TitleAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize + 36 %>px; PADDING-TOP: 0px; }
		H2 {font: <%=H2Size %>pt <%=H2Font %>;  font-weight:  <%=TitleWeight %> ;  <% if TitleItalics = "Yes" then %> font-style: italic;<% end if %> color: <%=H2Color %>; text-align: <%=H2Align %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize + 26 %>px; PADDING-TOP: 0px; }
		H3 {font: <%=H3Size %>pt <%=H3Font %>;  font-weight:  <%=TitleWeight %> ;  <% if TitleItalics = "Yes" then %> font-style: italic;<% end if %> color: <%=H3Color %>; text-align: <%=H3Align %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize + 6 %>px; PADDING-TOP: 0px; }

		LI UL {font: <%=PageTextFontSize%>pt <%=PageTextFont%>; color: <%=PageTextHyperlinkColor %>; text-decoration :none;}
		.Body {font: <%=PageTextFontSize%>pt <%=PageTextFont%>;  font-weight:  <%=PageTextWeight %> ;  <% if PageTextItalics = "Yes" then %> font-style: italic;<% end if %> color: <%=PageTextColor %>; text-align: <%=PageTextAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize +2 %>px; PADDING-TOP: 0px; }
		A.Body {font: <%=PageTextFontSize%>pt <%=PageTextFont%>; font-weight:  <%=PageTextWeight %> ;  <% if PageTextItalics = "Yes" then %> font-style: italic;<% end if %>  color: <%=PageTextHyperlinkColor %>; text-decoration :none; text-align: <%=PageTextAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize +2 %>px; PADDING-TOP: 0px; }
		A.Body:hover {font: <%=PageTextFontSize%>pt <%=PageTextFont%>; font-weight:  <%=PageTextWeight %> ;  <% if PageTextItalics = "Yes" then %> font-style: italic;<% end if %> color: <%=PageTextMouseOverColor %> ; text-decoration :none; text-align: <%=PageTextAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize +2 %>px; PADDING-TOP: 0px; }
		
		
		.Menu {font: <%=MenuSize%>pt <%=MenuFont%>; font-weight:  <%=MenuWeight %> ;  <% if MenuItalics = "Yes" then %> font-style: italic;<% end if %> color: <%=MenuColor %>; text-align: center; text-align: <%=MenuAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize +2 %>px; PADDING-TOP: 0px; }
		A.Menu {font: <%=MenuSize%>pt <%=MenuFont%>; font-weight:  <%=MenuWeight %> ;  <% if MenuItalics = "Yes" then %> font-style: italic;<% end if %>  color: <%=MenuColor %> ; text-decoration :none; text-align: <%=MenuAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize +2 %>px; PADDING-TOP: 0px; }
		A.Menu:Hover { font: <%=MenuSize%>pt <%=MenuFont%>; font-weight:  <%=MenuWeight %> ;  <% if MenuItalics = "Yes" then %> font-style: italic;<% end if %>  color: <%=MenuFontMouseOverColor %> ; text-align: <%=MenuAlign %>; PADDING-RIGHT: 0px; PADDING-LEFT: 0px; PADDING-BOTTOM: 0px; MARGIN: 0px; LINE-HEIGHT: <%=TitleSize +2 %>px; PADDING-TOP: 0px; }
		
		

		

</style>


<%
'End If 
'**************************************************************
 ' Close RecordSet
'**************************************************************
Rs.close


'**************************************************************
 ' Get Links
'**************************************************************
dim PageNameArray(100)
dim FileNameArray(100)

sql = "select Linkname, FileName from PageLayout where PageAvailable = True order by LinkOrder" 
'response.write(sql)
		
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
'response.write(sql)
rs.Open sql, conn, 3, 3
If Not rs.eof then
'**************************************************************
 ' Gather List of Pages
'**************************************************************

PageText = rs("PageText")

PageTitle = rs("PageTitle")
'response.write("Pagetitle=" & Pagetitle)
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

'**************************************************************
 ' Open RecordSet From sfCustomer
'**************************************************************
sql = "select * from AndresenEvents where CustID = 66;"
'response.write(sql)
rs.Open sql, conn, 3, 3
If Not rs.eof then
FavIcon= rs("FavIcon")
FavIconShortcut= rs("FavIconShortcut")

end if 

'**************************************************************
 ' Close RecordSet
'**************************************************************
Rs.close

%>


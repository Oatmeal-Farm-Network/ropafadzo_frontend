<% SetLocale("en-us") %>
<html>
<head>
<%  PageName = "FiberMania - Vendors" 
showname = "FiberMania " & Year(now)
%>
<!--#Include file = "GlobalVariables.asp"-->
<title><%= SEOTitle %></title>
<META name="description" content="<%= SEODescription %> ">
<META name="keywords" content="<%= SEOKeyword1 %>, 
<%=SEOKeyword2%>, 
<%=SEOKeyword3 %>,
<%=SEOKeyword4 %>, 
<%=SEOKeyword5 %>, 
<%=SEOKeyword6 %>,  
<%=SEOKeyword7 %>, 
<%=SEOKeyword8 %>, 
<%=SEOKeyword9 %>, 
<%=SEOKeyword10 %>, 
<%=SEOKeyword11 %>, 
<%=SEOKeyword12 %>, 
<%=SEOKeyword13 %>, 
<%=SEOKeyword14 %>, 
<%=SEOKeyword15 %>, 
<%=SEOKeyword16 %>, 
<%=SEOKeyword17 %>, 
<%=SEOKeyword18 %>, 
<%=SEOKeyword19 %>, 
<%=SEOKeyword20 %> ">
<meta name="author" content="WebArtists.biz">
<link rel="stylesheet" type="text/css" href="<%=style%>">
<% 
Set rs = Server.CreateObject("ADODB.Recordset")
sql = "select * from  Pagelayout where PageName = '" & PageName & "'"
rs.Open sql, conn, 3, 3
If not rs.eof then
PageTitle = rs("PageTitle")
PageHeading1= rs("PageHeading1")
PageHeading2= rs("PageHeading2")
PageHeading3= rs("PageHeading3")
PageHeading4= rs("PageHeading4")
PageHeading5= rs("PageHeading5")
PageHeading6= rs("PageHeading6")
PageHeading7= rs("PageHeading7")
PageText1 = rs("PageText")
PageText2 = rs("PageText2")
PageText3 = rs("PageText3")
PageText4 = rs("PageText4")
PageText5 = rs("PageText5")
PageText6 = rs("PageText6")
PageText7 = rs("PageText7")
Image1= rs("Image1")
Image2= rs("Image2")
Image3= rs("Image3")
Image4= rs("Image4")
Image5= rs("Image5")
Image6= rs("Image6")
Image7= rs("Image7")
ImageCaption1= rs("ImageCaption1")
ImageCaption2= rs("ImageCaption2")
ImageCaption3= rs("ImageCaption3")
ImageCaption4= rs("ImageCaption4")
ImageCaption5= rs("ImageCaption5")
ImageCaption6= rs("ImageCaption6")
ImageCaption7= rs("ImageCaption7")
ImageOrientation1= rs("ImageOrientation1")
ImageOrientation2= rs("ImageOrientation2")
ImageOrientation3= rs("ImageOrientation3")
ImageOrientation4= rs("ImageOrientation4")
ImageOrientation5= rs("ImageOrientation5")
ImageOrientation6= rs("ImageOrientation6")
ImageOrientation7= rs("ImageOrientation7")
SectionTitle1= rs("SectionTitle1")
SectionTitle2= rs("SectionTitle2")
SectionTitle3= rs("SectionTitle3")
SectionTitle4= rs("SectionTitle4")
SectionTitle5= rs("SectionTitle5")
SectionTitle6= rs("SectionTitle6")
SectionTitle7= rs("SectionTitle7")
rs.close
End If %>
</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" >
<!--#Include file="Header.asp"-->
<!--#Include file="FiberManiaHeader.asp"-->

<iframe src="http://www.andresenevents.com/IFrameEventVendors.asp?EventID=14" frameborder =0 width = "780" height = "1280" scrolling = "no" bgcolor ="#FDF4DD"></iframe> 
<!--#Include file="FiberManiaFooter.asp"-->
<!--#Include File="Footer.asp"-->

</body>
</html>
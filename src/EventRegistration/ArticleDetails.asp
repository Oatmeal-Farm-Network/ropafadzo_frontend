<% SetLocale("en-us") %>
<html>
<head>
<%  PageName = "Articles" %>
<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= SEOTitle %> </title>
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

<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="<%=style%>">

</HEAD>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"   width = "<%=TextWidth%>">
<tr><td class = "body"  >
			<h1><%=PageTitle %></h1>
</td></tr></table>
<table border = "0" width = "<%=TextWidth%>" align = "center">
<tr>
  <td colspan = "2" class = "body">
<%
dim aArticleID(40000)
dim aArticleHeadline(40000)
dim aArticle(40000)

ArticleID= Request.QueryString("ArticleID") 
				
Set rs = Server.CreateObject("ADODB.Recordset")

sql =  "select * from Articles where ArticleID = " & ArticleID
'response.write(sql2)
acounter = 1
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3 
	
if Not rs.eof  then
	ArticleHeadline = rs("ArticleHeadline")
	Author = rs("Author")
	AuthorLink = rs("AuthorLink")
	CurrentCatID= rs("ArticleCatID")
end	if

Dim pageheadings(1000)
Dim PageTextArray(1000)
Dim ImageArray(1000)
Dim ImageCaptionArray(1000)
Dim ImageOrientationArray(1000)

 For i = 1 To 20
	 'response.write("i=" & i)
		 pageheadings(i) = rs("PageHeading" & i  )
		 PageTextArray(i) = rs("ArticleText" & i )
		 ImageArray(i) = rs("ArticleImage" & i )
	
		 ImageCaptionArray(i) = rs("ImageCaption" & i )
		 ImageOrientationArray(i) = rs("ImageOrientation" & i )

		 str1 = PageTextArray(i)
		str2 = vblf
		If InStr(str1,str2) > 0 Then
			PageTextArray(i)= Replace(str1, str2 , "</br>")
		End If  

		str1 = PageTextArray(i)
		str2 = vbtab
		If InStr(str1,str2) > 0 Then
			PageTextArray(i)= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
		End If  

Next
		rs.close
		set rs=nothing
	%>
	<br>
		<h2><%=ArticleHeadline %></h2>
		<% If Len(Author) > 1 Then%>
			by <%=Author %>
		<% End If %>
		<% If Len(AuthorLink) > 1 Then%>
				<a href = "http://<%=	AuthorLink %>" class = "body" target = "blank"><%=	AuthorLink %></a>
		<% end if %>
		<br>
	<%
 For i = 1 To 20
           If Len(ImageOrientationArray(i) ) > 1 then
			TempOrientation = ImageOrientationArray(i) 
		 Else
		 TempOrientation = "Right"
		 End If 

			TempImage = ImageArray(i) 
		 	TempImageCaption =  ImageCaptionArray(i) 
			TempHeading = pageheadings(i)
			TempPageText = PageTextArray(i)  
			
			If Len(TempPageText ) > 2 then
			%>
			
<!--#Include file="CaptionedPageTextInclude.asp"-->
<br>	
<%  End If 

Next %>
		<% If Len(ArticleImage) > 1 Then%>
				<img src = "/uploads/<%= ArticleImage %>" align = "right" border = "2" width = "200">
		<% End If %>
			<%=	ArticleText %>
</blockquote>
<br><br>
		</td>
	</tr>
</table>	


<%			 
If CurrentCatID = 1 then
	sql2 =  "select * from Articles order by ArticleID"
Else
	sql2 =  "select * from Articles where ArticleCatID= " & CurrentCatID & " and not (ArticleID = " & ArticleID & ") order by ArticleHeadline"
End if
'response.write(sql2)
			acounter = 1

			Set rs2 = Server.CreateObject("ADODB.Recordset")
			rs2.Open sql2, conn, 3, 3 
	
			While Not rs2.eof  
				aArticleID(acounter) = rs2("ArticleID")
				aArticleHeadline(acounter) = rs2("ArticleHeadline")

				acounter = acounter +1
				rs2.movenext
			Wend		
	
		rs2.close
		set rs2=nothing
		
%>

<table border = "0" bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "<%=TextWidth%>" align = "center">
	<tr>
		<td valign = "top" class = "body">
	  <blockquote>
	  <h3>Related Articles:</h3>

		  <% count = 0 
		while count < acounter
		  count = count +1 %>
				 	 &nbsp;<a href = "ArticleDetails.asp?ArticleID=<%=aArticleID(count)%>&CatID=<%=CurrentCatID%>" class = "body"><%=aArticleHeadline(count)%></a><br>
		<% Wend %>

 &nbsp;<a href = "Library.asp" class = "body"><big>View the Complete List of Articles</big></a><br>
		 </blockquote>
		</td>
	</tr>
</table>

<% 'rs.movenext
				'Wend

							
				%>
		
	
<!--#Include file="Footer.asp"--> 
</body>
</html>


<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
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
	<tr>
	    <td class = "body"  >
			<h1><%=PageTitle %></h1>
			</td>
	</tr>
	<TR>
			<td colspan = "2"  valign = "top" height = "2" valign = "top" BGCOLOR = "black">
				<img src = "images/px.gif" height = "2" border = "0"></td>
		</tr>	
		</table>

	
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"   width = "<%=TextWidth%>">
<tr>
  <td colspan = "2" class = "body">
<blockquote>
<%=PageText %>


				<%dim aArticleHeadline(40000)
				dim aArticleID(40000)
			    Dim ArticleUpload(40000)
				dim aArticle(40000)

 				Set rs = Server.CreateObject("ADODB.Recordset")
				sql =  "select * from ArticleCategories where not (ArticleCatID = 2)"
				rs.Open sql, conn, 3, 3 
				While Not rs.eof 
				   CurrentCatID  = rs("ArticleCatID")
				   ArticleCategoryName   = rs("ArticleCategoryName")
				   %>
				   <br>
		<table width = "700" bgcolor = "#96BDCC">
			<tr>
				<td class = "body"><font color = "black">Articles about <b><%=ArticleCategoryName %>:</b></font></td>
			</tr>
		</table>
	
			<%	



	
				If CurrentCatID = 1 then
				sql2 =  "select * from Articles where ArticleCatID = " & CurrentCatID & " order by ArticleID"
				Else
				  sql2 =  "select * from Articles where ArticleCatID = " & CurrentCatID & " order by ArticleHeadline"

				End if
'response.write(sql2)
			
			acounter = 1
		
				Set rs2 = Server.CreateObject("ADODB.Recordset")
				
				rs2.Open sql2, conn, 3, 3 
				

	
			While Not rs2.eof  
				aArticleID(acounter) = rs2("ArticleID")
				aArticleHeadline(acounter) = rs2("ArticleHeadline")
					ArticleUpload(acounter) = rs2("ArticleUpload")
				acounter = acounter +1
				rs2.movenext
			Wend		
	
%>



<table border = "0" bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
	<tr>
		<td valign = "top" class = "body">
		<% count = 0 
		while count < acounter - 1
		  count = count +1 
		    If Len(ArticleUpload(count)) > 1 Then %>
			&nbsp;<a href = "<%=ArticleUpload(count)%>" target = "blank" class = "body"><%=aArticleHeadline(count)%> (PDF Format)</a><br>

		   <%
		   else
		  %>
				 	 &nbsp;<a href = "ArticleDetails.asp?ArticleID=<%=aArticleID(count)%>&CatID=<%=CurrentCatID%>" class = "Article"><%=aArticleHeadline(count)%></a><br>
		<% 
		End if
		Wend %>
		</td>
	</tr>
</table>

<% rs.movenext
				Wend
				%>
				</blockquote>
		</td>
	</tr>
</table>	
<!--#Include file="Footer.asp"--> 
</body>
</html>


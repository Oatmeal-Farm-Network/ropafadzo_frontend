<%@ Language="VBScript" %> 
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title>Links - Alpaca Event Registration at Andresen Events</title>
<META name="Title" content="Links - Alpaca Event Registration at Andresen Events">
<META name="description" content="Helpful Links to other website.">
<META name="keywords" content="alpaca events, livestock events, events,Alpaca event registration, Livestock event registration, online registration, event registration, online event registration, event registration software, event registration online, online event registration software, event registration management software, event registration system, event management, registration software, event registration service, event registration services, easy online event registration, online event registration service, event registration website, event registration site, online event registration services,  PayPal, credit cards, online payments"> 
<meta name="robots" content="index,follow">
<meta name="rating" content="Safe for kids">
<meta name="revisit-after" content="1">
<meta name="Googlebot" content="index,follow">
<meta name="robots" content="All">
<meta name="subjects" content="Event Registration, Links" >
<link rel="shortcut icon" href="/AELogo.ico" > 
<link rel="icon" href="http://www.AndresenEvents.com/AELogo.ico" > 
<meta name="author" content="The Andresen group">
<link rel="stylesheet" type="text/css" href="Style.css">
</Head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<%  PageName = "Links" %>
<!--#Include file="GlobalVariablesNotLoggedIn.asp"--> 

<% textwidth = 800 %>
     <!--#Include file="Header.asp"--> 
         <br>
        <Table border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center" valign = "top" width = "<%=textwidth%>">
	<tr>
		<td align = "center" class ="body" background = "/images/HeadingUnderline.gif" height = "64"><h1><%=PageTitle %></h1></td>
</tr>
</table>
<br>

<Table border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center" valign = "top"  width = "<%=textwidth %>" >
<tr><td  class = "body" valign = "top"  align = "left" height = "300">


<% 
	' Get marketing text for the top of the page:
     
	sql = "SELECT  * FROM LinkCategoriesLookup order by CatID" 
	'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   

	
	While Not rs.eof 
	CurrentCatID  = rs("catID")
	  %>
     

     <% sql2 = "SELECT * FROM Links where CatID = " & CurrentCatID 
		'response.write (sql2)
		 Set rs2 = Server.CreateObject("ADODB.Recordset")
		 rs2.Open sql2, conn, 3, 3  
		 
		 If Not rs2.eof then
		 %>
			<h3><b><%=rs("CategoryName")%></b></h3>
      <%
	  End If 
	  While Not rs2.eof
	      
       %>
        <table cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center" valign = "top" width = "<%=textwidth %>">
		    <tr>
			   <td width = "100">
			       <% If Len(rs2("LinkImage")) >2 Then %>
			   		   <a href = "http://<%=rs2("Link")%>" target = "blank"><img src = "<%=rs2("LinkImage")%>" width = "80" border = "0">
					   </a>
					 <% End If %> 
			   </td>
			   <td class = "body" valign = "top">
			   <% If Len(rs2("Link")) >2 Then %>
			   	   <a href = "http://<%=rs2("Link")%>" target = "blank" class = "body"><b><%=rs2("LinkText")%></b></a><br>
				  <% Else %>
				   <b><%=rs2("LinkText")%></b><br>
				   <% End If %>
				   
				   <%=rs2("Linkdescription")%><br> <br>
			   </td>
			</tr>
		</table>

	<%   rs2.movenext
	wend
	%>
<%   rs.movenext
	wend
%>

<% rs.close %>


		</td>
	</tr>
</table>
<!--#Include file = "Footer.asp"--> 

</body>
</html>
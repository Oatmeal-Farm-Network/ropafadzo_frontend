<% SetLocale("en-us") %>
<html>

<head>
<!--#Include file="/AlpacaBargainHunter/GlobalVariables.asp"-->
<!--#Include file="/alpacabargainhunter/FormatPrice.asp"--> 
<title><%= WebSiteName %> - Our Alpacas</title>
<meta name="description" content="<%= Breed %> Alpacas for Sale">
<META name="keywords" content="<%=State%> Alpaca Ranch, <%= WebSiteName %>, <%= Slogan %>, <%= Breed %>Alpacas, alpacas, alpaca,  female alpacas, male alpacas">
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="<%=Style%>">


</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include file="/AlpacaBargainHunter/Header.asp"-->
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"   width = "590">
	<tr>
	     <td class = "body"  background = "images/H1background.jpg" height = "83">
			<br><h1>Our Alpacas</h1>
		</td>
	</tr>
	<tr>
		<td align = "right"><blockquote>
					<br>
					
						<a name="top"></a><a href = "#Females" class ="body">Female Alpacas |</a> 
								   <a href = "#Males" class ="body">Male Alpacas</a>
					  	<br></td>
	</tr>
</table>


<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  width = "590"  height = "350" valign ="top">
	<tr>		
		 <td  align = "center" valign ="top">

				<table width = "590"   border="0" cellspacing="0" cellpadding="0"  align = "center">
					<tr>
						<td  class = "body" valign = "top"  align = "center">
							<table width = "590"   border="0" cellspacing="0" cellpadding="0" >
								<tr>
									<td class = "body" valign = "top" width = "300">
											<br>
				
											


<a name="Females"></a>
<table border = "0" width = "590"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >
<tr>
	<td colspan = "2"   height = "30"  >
			<H2>Female Alpacas<br><img src = "images/line.jpg" width = "590"></H2></td>
		</tr>
	<tr>
				<td colspan = "2" height = "9" valign = "top">&nbsp;</td>
</tr>

<% 	conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" '& _ 
	' Get marketing text for the top of the page:
     
	sql = "SELECT Animals.*, Pricing.*, Photos.*, Ancestors.*, Femaledata.* FROM Animals, Pricing, Photos, Ancestors, Femaledata WHERE Animals.ID=Pricing.ID And Animals.ID=Photos.ID And Animals.ID=Ancestors.ID And Femaledata.ID=Animals.ID And Animals.ID=Ancestors.ID and (Category = 'Dam' or Category = 'Maiden' ) " 
	'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
 
	



 	if rs.eof then %>
		  <tr><td class = "body" ><blockquote>We currently do not have any Female Alpacas.  Please check back with us for updates!</blockquote>
		<br><br></td></tr>  
	<%end if%>
<% DetailType = "Dam" %>
<!--#Include file="/DetailIncludeBD.asp"--> 










	<a name="Males"></a>
<table border = "0" width = "590"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >
<tr>
	<td colspan = "2"   height = "30"  >
			<H2>Male Alpacas<br><img src = "images/line.jpg" width = "590"></H2></td>
		</tr>
	<tr>
		<tr>
	<td colspan = "2"  valign = "top" height = "2" valign = "bottom" ><img src = "images/px.gif" height = "2" border = "0"></td>
		</tr>
	
	<tr>
				<td colspan = "2" height = "9" valign = "top">&nbsp;</td>
</tr>

<% 	conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" '& _ 
	' Get marketing text for the top of the page:
     
	sql = "select * from webView where (Category = 'Herdsire' or Category = 'Jr. Herdsire')  order by FullName" 
	' response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
 
 	if rs.eof then %>
		  <tr><td class = "body" ><blockquote>We currently do not have any of our male alpacas.  Please check back with us for updates!</blockquote>
		<br><br></td></tr>  
	<%end if%>
<% DetailType = "Sire" %>
<!--#Include file="/AlpacaBargainHunter/DetailInclude.asp"--> 
<br>



	
<br>






</td>
		</tr>
</table> <div><a href = "#top" class ="body">&nbsp;Return to the top of this page</a></div><br><br>
			</td>
		</tr>
</table>
			</td>
		</tr>
</table>
			</td>
		</tr>
</table>
 <!--#Include file="/alpacabargainhunter/Footer.asp"--> 
</body>
</html>


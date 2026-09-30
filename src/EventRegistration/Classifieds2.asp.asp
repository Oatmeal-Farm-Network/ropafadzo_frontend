<% SetLocale("en-us") %>
<html>

<head>
<!--#Include file="/AlpacaBargainHunter/GlobalVariables.asp"-->
<!--#Include file="/alpacabargainhunter/FormatPrice.asp"--> 
<title><%= WebSiteName %> - Full Accoyo Suris for Sale</title>
<meta name="description" content=" Full Accoyo Suris for Sale">
<META name="keywords" content="Alpaca Broker, <%= WebSiteName %>, <%= Slogan %>, <%= Breed %>Alpacas, alpacas, alpaca,  female alpacas, male alpacas">
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="<%=Style%>">


</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include file="/AlpacaBargainHunter/Header.asp"-->
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"   width = "640" height = "40">
	<tr>
	     <td class = "body"  valign = "top" background = "images/HomeJr.Herdsires.jpg">

		</td>
	</tr>
</table>


<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  width = "650"  height = "350" valign ="top">
	<tr>		
		 <td  align = "center" valign ="top">
	<div align ="right"><a href = "#Suris" class ="body">Females</a> | 
					     <a href = "#Suris" class ="body">Males</a>&nbsp;&nbsp;&nbsp;&nbsp;</div>
				<table width = "650"   border="0" cellspacing="0" cellpadding="0"  align = "center">
					<tr>
						<td  class = "body" valign = "top"  align = "center">
							<table width = "650"   border="0" cellspacing="0" cellpadding="0" >
								<tr>
									<td class = "body" valign = "top" width = "300"><a name="females"></a>
	<table border = "0" width = "650"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >

	<tr>
				<td colspan = "2"  valign = "top"><h2>Suri Full-Accoyo Females for Sale</h2></td>
</tr>
<tr>
			<td colspan = "2" height = "1" bgcolor = "black"  valign = "top"><img src = "images/px.gif" height="1"></td>
</tr>

<% 	conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" '& _ 
	' Get marketing text for the top of the page:
     
     
	sql = "SELECT Animals.*, Pricing.*, Photos.*, Ancestors.* FROM Animals, Pricing, Photos, Ancestors WHERE Animals.ID=Pricing.ID And Animals.ID=Photos.ID And Animals.ID=Ancestors.ID  And Animals.ID=Ancestors.ID   and PercentAccoyo = 'FullAccoyo' and Breed = 'Suri'  and (category = 'dam' or category = 'Maiden')" 
	'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
 
	



 	if rs.eof then %>
		  <tr><td class = "body" ><blockquote>We currently do not have any Suri Full-Accoyo Females for Sale.  Please check back with us for updates!</blockquote>
		<br><br></td></tr>  
	<%end if%>
<% DetailType = "Other" %>
<!--#Include file="/AlpacaBargainHunter/DetailInclude.asp"--> 





<br><br>

<a name="Suris"></a>
<table border = "0" width = "650"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >

	<tr>
			<td colspan = "2"  valign = "top"><h2>Suri Full-Accoyo Males for Sale</h2></td>
</tr>
	<tr>
			<td colspan = "2" height = "1" bgcolor = "black"  valign = "top"><img src = "images/px.gif" height="1"></td>
</tr>

<% 	conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" '& _ 
	' Get marketing text for the top of the page:
     
	sql = "SELECT Animals.*, Pricing.*, Photos.*, Ancestors.* FROM Animals, Pricing, Photos, Ancestors WHERE Animals.ID=Pricing.ID And Animals.ID=Photos.ID And Animals.ID=Ancestors.ID  And Animals.ID=Ancestors.ID   and PercentAccoyo = 'FullAccoyo' and Breed = 'Suri'  and (category = 'Juvenilemale' or category = 'Jr.Herdsire' or category = 'Herdsire')" 
	'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
 
	



 	if rs.eof then %>
		  <tr><td class = "body" ><blockquote>We currently do not have any Suri Full-Accoyo Males for Sale.  Please check back with us for updates!</blockquote>
		<br><br></td></tr>  
	<%end if%>
<% DetailType = "Other" %>
<!--#Include file="/AlpacaBargainHunter/DetailInclude.asp"--> 





<br><br>
	
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

 <!--#Include file="/alpacabargainhunter/Footer.asp"--> 
</body>
</html>


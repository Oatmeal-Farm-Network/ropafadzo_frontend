<% SetLocale("en-us") 

CustID=Request.QueryString("CustID") 

%>
<html>

<head>
<!--#Include virtual="/GlobalVariables.asp"-->

<% conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
			Set rs = Server.CreateObject("ADODB.Recordset")
			
			sql = "select  SfCustomers.* from SFCustomers where SFCustomers.custID= " & CustID
				'response.write(sql)
				rs.Open sql, conn, 3, 3
				If not rs.eof then
				 WebLink = rs("WebLink")
				 'response.write(WebLink)
				
					RanchHomeImage = rs("RanchHomeImage")
					RanchHomeHeading = rs("RanchHomeHeading")
				   custFirstName = rs("custFirstName")
				    custSlogan = rs("custSlogan")
				   custMiddleInitial  = rs("custMiddleInitial")
					custLastName  = rs("custLastName")
					custCompany   = rs("custCompany")
					custAddr1  = rs("custAddr1")
					custAddr2  = rs("custAddr2")
					custCity  = rs("custCity")
					custState   = rs("custState")
					custZip   = rs("custZip")
					custCountry   = rs("custCountry")
					custPhone   = rs("custPhone")
					custPhone2   = rs("custPhone2")
					custFAX   = rs("custFAX")
					Logo   = rs("Logo")
					Header   = rs("Header")
				RanchHomeText   = rs("RanchHomeText")


					str1 = WebLink
					str2 = "http://"
					If InStr(str1,str2) > 0 Then
							WebLink= Replace(str1,  str2, "")
					End If 

				rs.close
			End If 
			%>
<title><%= custCompany %> Stud Services</title>
<meta name="description" content="<%= custCompany %> Stud Services at SOJAA.com">
<META name="keywords" content="<%= custCompany %>, <%= custCompany %> Alpacas, <%= Slogan %>, <%= Breed %>Alpacas, alpacas, alpaca,  female alpacas, male alpacas">
<meta name="author" content="WebArtists.biz">
<link rel="stylesheet" type="text/css" href="SOJAA.css">



</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include virtual="/Header.asp"-->

<!--#Include virtual="/RanchHeader.asp"-->
<br><table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"   width = "700">
	<tr>
  	 <td >

<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"   width = "700">
	<tr>
	     <td class = "body"  >			
			<br><h1>Stud Services</h1>
		</td>
	</tr>
	<tr>
		<td align = "center"><blockquote>
					
					
						<a name="top"></a>
					   <a href = "#Herdsires" class ="body">Herdsires |</a>
					   <a href = "#Jr.Herdsires" class ="body">Jr. Herdsires </a> 
		</td>
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
				
											








	<a name="Herdsires"></a>
<table border = "0" width = "590"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >
<tr>
	<td colspan = "2"   height = "30"  >
			<H2>Herdsires<br><img src = "images/line.jpg" width = "590"></H2></td>
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
     
	sql = "SELECT DISTINCT Animals.*, Pricing.*, Photos.*, Ancestors.*, Colors.*, sfcustomers.activemember FROM Animals, Pricing, Photos, Ancestors, colors, sfCustomers WHERE sfCustomers.custid=animals.custid And sfCustomers.ActiveMember=True  and Animals.ID=Pricing.ID And Animals.ID=Colors.ID and Animals.ID=Photos.ID And Animals.ID=Ancestors.ID  And Animals.ID=Ancestors.ID and (Category = 'Male-Proven' or Category = 'Experienced Male') and Sold = False and len(studfee) > 2 and CustID = " & CustID & " order by StudFee Desc ;"  
	' response.write (sql)
 
	' response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
 
 	if rs.eof then %>
		  <tr><td class = "body" ><blockquote>We currently do not have any  herdsires.  Please check back with us for updates!</blockquote>
		<br><br></td></tr>  
	<%end if%>
<% DetailType = "Sire" %>
<!--#Include virtual="/HerdsiresDetailIncludeBD.asp"--> 
<br>
</td>
		</tr>
<tr>
<td>


<a name="Jr.Herdsires"></a>
<table border = "0" width = "590"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >
<tr>
	<td colspan = "2"   height = "30"  >
			<H2>Jr. Herdsires<br><img src = "images/line.jpg" width = "590"></H2></td>
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
     
	sql = "SELECT Animals.*, Pricing.*, Photos.*, Ancestors.*,  Colors.* FROM Animals, Pricing, Photos, Ancestors,  Colors WHERE Animals.ID=Pricing.ID And Animals.ID=Colors.ID And Animals.ID=Photos.ID And Animals.ID=Ancestors.ID  And Animals.ID=Ancestors.ID and (Category = 'Male-Unproven' or Category = 'Unexperienced Male' ) and CustID = " & CustID 
	' response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
 
 	if rs.eof then %>
		  <tr><td class = "body" ><blockquote>We currently do not have any jr. herdsires.  Please check back with us for updates!</blockquote>
		<br><br></td></tr>  
	<%end if%>
<% DetailType = "Sire" %>
<!--#Include virtual="/HerdsiresDetailIncludeBD.asp"--> 
<br>


	
<br>

<br>

<br>
</td>
</tr>
<tr>
<td>

<div><a href = "#top" class ="body">&nbsp;Return to the top of this page</a></div><br><br>

		</td>
		</tr>
</table>
			</td>
		</tr>
</table>
			</td>
		</tr>
</table>
			</td>
		</tr>
</table>
			</td>
		</tr>
</table>
			</td>
		</tr>
</table>
		</td>
		</tr>
</table>
 <!--#Include virtual="/Footer.asp"--> 
</body>
</html>


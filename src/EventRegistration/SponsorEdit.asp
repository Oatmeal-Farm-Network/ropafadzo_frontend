<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<%@ Language=VBScript %>

<HTML>
<HEAD>
<title>Sponsorship Options</title>
<link rel="stylesheet" type="text/css" href="style.css">
</head>
<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>
<% EventId = request.querystring("EventID") %> 
<!--#Include file="AdminEventGlobalVariables.asp"-->
<% Current = "admin" %>
<!--#Include file="AdminEventsHeader.asp"-->




<!--#Include file="SponsorHeader.asp"--> 

<% PageTitleText = "Edit Sponsors"  %>
<!--#Include file="970Top.asp"-->

<% Dim name(2000) 
rowcount = rowcount
%>
<form  action="EditSponsorshandle.asp" method = "post">
	<input type = "hidden" name="EventID" value= "<%= EventID %>" >
<table width = "750" border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=0>

<%
row = "odd"
rowcount = 1
row = "even"

 sql = "select business.AddressID as BusinessAddressID, * from Sponsor, Business, Address, SponsorshipLevels, BusinessTypeLookup, People, Phone, websites where Sponsor.BusinessID = Business.BusinessID and Sponsor.AddressID = Address.AddressID and Sponsor.SponsorshiplevelID = SponsorshipLevels.SponsorshiplevelID and Business.BusinessTypeID = BusinessTypeLookup.BusinessTypeID and People.BusinessId = Business.BusinessID and Business.PhoneID = Phone.PhoneID and Business.BusinessWebsiteID = Websites.WebsitesID and Sponsor.EventID = " & EventID & " order by Sponsor.EventID Desc"
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	
	While Not rs.eof  
	SponsorID = rs("SponsorID")
	BusinessID = rs("BusinessID")
	BusinessAddressID = rs("BusinessAddressID")
	SponsorLevel  = rs("SponsorshipLevelName")
	SponsorshiplevelID = rs("SponsorshipLevelID")
	SponsorshiplevelName = rs("SponsorshiplevelName")
	SponsorPaidAmount = rs("SponsorPaidAmount")
	SponsorPaidAmountMonth  = rs("SponsorPaidAmountMonth")
	SponsorPaidAmountDay = rs("SponsorPaidAmountDay")
	SponsorPaidAmountYear = rs("SponsorPaidAmountYear")
	SponsorQTY = rs("SponsorQTY")
	if len(SponsorQTY) > 0 then
     else
      SponsorQTY = 1
    end if
     SponsorshipLevelPrice = rs("SponsorshipLevelPrice")
	BusinessTypeID = rs("BusinessTypeID")
	BusinessType = rs("BusinessType")
	BusinessName = rs("BusinessName")
	BusinessAddress = rs("AddressStreet")
	BusinessApt = rs("AddressApt")
	BusinessCity = rs("AddressCity")
	BusinessState = rs("AddressState")
	BusinessCountry = rs("Addresscountry")
	BusinessEmail = rs("BusinessEmail")	
	BusinessLogo = rs("BusinessLogo")
	BusinessZip = rs("AddressZip")
	BusinessHours = rs("BusinessHours")
	PeopleFirstName = rs("PeopleFirstName")
	PeopleLastName = rs("PeopleLastName")
	BusinessFax = rs("Fax")

	BusinessCell = rs("CellPhone")
	BusinessPhone = rs("Phone")
	BusinessWebsite = rs("Website")
	BusinessWebsiteID=rs("BusinessWebsiteID")
	BusinessPhoneID=rs("PhoneID")
	PeopleID = rs("PeopleID")

%>
	
<a name = "<%=SponsorID%>"><a>

	<input type = "hidden" name="SponID(<%=rowcount%>)" value= "<%= SponID %>" >

	<input type = "hidden" name="BusinessWebsiteID(<%=rowcount%>)" value= "<%= BusinessWebsiteID %>" >
	<input type = "hidden" name="BusinessAddressID(<%=rowcount%>)" value= "<%= BusinessAddressID %>" >
	<input name="BusinessPhoneID(<%=rowcount%>)" Value ="<%=BusinessPhoneID%>"  type = "Hidden">
	<input name="BusinessID(<%=rowcount%>)" Value ="<%=BusinessID%>"  type = "Hidden">
	<input name="PeopleID(<%=rowcount%>)" Value ="<%=PeopleID%>"  type = "Hidden">
	<input name="SponsorID(<%=rowcount%>)" Value ="<%=SponsorID%>"  type = "Hidden">

<%  If row = "even" Then
		row = "odd"
	Else
		row = "even"
	End if
 If row = "even" Then %>
	<table border = "0" width = "940"  align = "center" bgcolor = "white">

<% Else %>
	<table border = "0" width = "940"  align = "center" bgcolor = "#DBF5F3" >

<% End If %>
<tr>
<td valign = "top">

<table width = "300" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center">
<tr><td class = "body2" align = "right" ><small>Sponsorship Level:</small></td>

	<%
		Set rs2 = Server.CreateObject("ADODB.Recordset")	
		sql = "select * from SponsorshipLevels where EventID = " & EventID
		rs2.Open sql, conn, 3, 3  
	%> 
  <td  class = "body2" >
			 <select size="1" name="SponsorshipLevelID(<%=rowcount%>)">
			<% if len(SponsorshiplevelName) > 1 then %>
				<option  value="<%=SponsorshiplevelID%>"><%= SponsorshipLevelName %></option>
			<% end if %>



			<% While Not rs2.eof  %>
				<option  value="<%=rs2("SponsorshiplevelID")%>"><%=rs2("SponsorshipLevelName")%></option>
 			<%  rs2.movenext
  				Wend 
  			%>	
			</select>
		</td>
</tr>
<tr>
	<td class = "body2" align = "right" width = "100"><small>Quantity:</small>
	</td>
	<td class = "body2">
		<input name="SponsorQTY(<%=rowcount%>)" Value ="<%=SponsorQTY%>" class="positive" size = "4" maxlength = "8">

	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>


	 </td>
<tr>
<tr>
	<td class = "body2" align = "right" ><small>Sponsorship Price:</small>
	</td>
	<td class = "body2">
		<%=formatcurrency(SponsorshipLevelPrice, 2)%>
	 </td>
<tr>
<tr>
	<td class = "body2" align = "right"><small>Order Cost:</small>
	</td>
	<td class = "body2">
		<%=formatcurrency(SponsorshipLevelPrice * SponsorQTY, 2)%>
	 </td>
<tr>



<tr>
	<td class = "body2" align = "right" ><small>Amount Paid:</small>
	</td>
	<td class = "body2">
		$<input name="SponsorPaidAmount(<%=rowcount%>)" Value ="<%=SponsorPaidAmount%>" class="positive" size = "4" maxlength = "8">

	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>


	 </td>
<tr>	 
<tr>
 <td class = "body2" align = "right"><small>Payment Date:</small>
 </td>
  <td class = "body2">

<select size="1" name="SponsorPaidAmountMonth">

		<% if len(SponsorPaidAmountMonth) > 0 then %>
					<option value="<%=SponsorPaidAmountMonth%>" selected><%=SponsorPaidAmountMonth%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">Jan.</option>
					<option  value="2">Feb.</option>
					<option  value="3">March</option>
					<option  value="4">April</option>
					<option  value="5">May</option>
					<option  value="6">June</option>
					<option  value="7">July</option>
					<option  value="8">Aug.</option>
					<option  value="9">Sept.</option>
					<option  value="10">Oct.</option>
					<option  value="11">Nov.</option>
					<option  value="12">Dec.</option>
				</select>
				<select size="1" name="SponsorPaidAmountDay">
		<% if len(SponsorPaidAmountDay) > 0 then %>
					<option value="<%=SponsorPaidAmountDay%>" selected><%=SponsorPaidAmountDay%></option>
				<% else %>
					<option value="" selected>------</option>
				<% end if %>

					<option value="1">1</option>
					<option  value="2">2</option>
					<option  value="3">3</option>
					<option  value="4">4</option>
					<option  value="5">5</option>
					<option  value="6">6</option>
					<option  value="7">7</option>
					<option  value="8">8</option>
					<option  value="9">9</option>
					<option  value="10">10</option>
					<option  value="11">11</option>
					<option  value="12">12</option>
					<option  value="13">13</option>
					<option  value="14">14</option>
					<option  value="15">15</option>
					<option  value="16">16</option>
					<option  value="17">17</option>
					<option  value="18">18</option>
					<option  value="19">19</option>
					<option  value="20">20</option>
					<option  value="21">21</option>
					<option  value="22">22</option>
					<option  value="23">23</option>
					<option  value="24">24</option>
					<option  value="25">25</option>
					<option  value="26">26</option>
					<option  value="27">27</option>
					<option  value="28">28</option>
					<option  value="29">29</option>
					<option  value="30">30</option>
					<option  value="31">31</option>
				</select>
		<select size="1" name="SponsorPaidAmountYear">
				<% if len(SponsorPaidAmountYear) > 0 then %>
					<option value="<%=SponsorPaidAmountYear%>" selected><%=SponsorPaidAmountYear%></option>
					
					<% if not SponsorPaidAmountYear = year(now) then%>
					  <option value="<%=year(now)%>" ><%=year(now)%></option>
					<% end if %>
					
					
				<% else %>
				   <option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

					
				
			<% currentyear = year(date) 
						
					For yearv=currentyear + 1 To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
		</td>
	   </tr>
<tr>
	  <td class = "body2" align = "right" ></td>
  		<td class = "body2"bgcolor = "brown" >
		<input TYPE="checkbox" name="Delete(<%=rowcount%>)" Value = "Yes" ><font color = "white">Delete This Sponsor</font>
		</td>
	</tr>


	 
</table>


</td>
<td valign = "top">	 
<table cellpadding = "0" cellspacing = "0" border = "0">
<tr>
	<td class = "body2" align = "right" width = "200"><small>Organization/Business Name:*</small>
	</td>
	<td class = "body2">
		<input name="BusinessName(<%=rowcount%>)" Value ="<%=BusinessName%>"  size = "23" maxlength = "61">
	 </td>
<tr>	 
<tr>
					<td class = "body2" align = "right" width = "180"><small>Organization's Type:</small></td>
	<td class = "body2">			
						<select size="1" name="BusinessTypeID(<%=rowcount%>)">
						<% if len(BusinessType) > 0 then %>
						
						<option value= "<%=BusinessTypeID %>"><%=BusinessType %></option>

						<% else %>
						<option value= "2">N/A</option>
						<% end if %>
						
<% 

  sql3 = "select * from BusinessTypeLookup where not BusinessTypeID = 2 "
  Set rs3 = Server.CreateObject("ADODB.Recordset")
  rs3.Open sql3, conn, 3, 3   
  if not rs3.eof then
  while not rs3.eof %>
  
		<option value= "<%=rs3("BusinessTypeID") %>"><%=rs3("BusinessType") %></option>
<% 
  rs3.movenext
  wend 
end if %>
 </select>
</td>
</Tr>
<tr><td class = "body2" align = "right"><small>Contact First Name:</small></td>
	<td class = "body2">
		<input name="PeopleFirstName(<%=rowcount%>)" Value ="<%=PeopleFirstName%>"  size = "23" maxlength = "61">
	</td>
</tr>
 <tr><td class = "body2" align = "right"><small>Contact Last Name:</small></td>
	<td class = "body2">
		<input name="PeopleLastName(<%=rowcount%>)" Value ="<%=PeopleLastName%>"  size = "23" maxlength = "61">
	</td>
</tr>

<tr>
  <td class = "body2" align = "right"><small>Hours of Operation: </small></td>
<td class = "body2">
	<input name="BusinessHours(<%=rowcount%>)" Value ="<%=BusinessHours%>"  size = "23" maxlength = "61">
</td>
</tr>

<tr>					
	<td   class = "body2" align = "right">
								<small>Phone: </small>
							</td>
							<td  align = "left" valign = "top" class = "body2">
							
								<input name="BusinessPhone(<%=rowcount%>)"  size = "15" value = "<%=BusinessPhone%>">
							</td>
</tr>

<tr>
	<td   class = "body2" align = "right">
		<small>Cell:</small>
	</td>
	<td  align = "left" valign = "top" class = "body2">
		<input name="BusinessCell(<%=rowcount%>)"  size = "15" value = "<%=BusinessCell%>">
</td>	
</tr>


	<td   class = "body2" align = "right"><small>Fax: </small></td>
	<td  align = "left" valign = "top" class = "body2"><input name="BusinessFax(<%=rowcount%>)"  size = "15" value = "<%=BusinessFax%>">
	</td>


</table>
</td>
<td valign = "top">	 
<table cellpadding = "0" cellspacing = "0" border = "0">
<tr>
	<td class = "body2" align = "right"><small>Email:*</small></td>
	<td class = "body2">
		<input name="BusinessEmail(<%=rowcount%>)" Value ="<%=BusinessEmail%>"  size = "23" maxlength = "61">
	</td>
</tr>	 
<tr>	 
  <td class = "body2" align = "right"><small>Website: </small></td>
   <td class = "body2">
		http://<input name="BusinessWebsite(<%=rowcount%>)" Value ="<%=BusinessWebsite%>"  size = "23" maxlength = "61">
	</td>
</tr>

<tr>
<td   class = "body2" align = "right">
	<small>Street: </small>
</td>
<td  align = "left" valign = "top" class = "body2">
	<input name="BusinessAddress(<%=rowcount%>)"  size = "15" value = "<%=BusinessAddress%>">
</td>
</tr>
<tr>
	<td   class = "body2"  align = "right">
		<small>Apartment / Suite: </small>
</td>
	<td  valign = "top" class = "body2">
		<input name="BusinessApt(<%=rowcount%>)"  size = "15" value = "<%=BusinessApt%>">
	</td>
</tr>
<tr>
	<td   class = "body2" align = "right">
		<small>City: </small>
	</td>
	<td  valign = "top" class = "body2">
		<input name="BusinessCity(<%=rowcount%>)"  size = "30" value = "<%=BusinessCity%>">
	</td>
</tr>
<tr>
<td  align = "right" class = "body2">
								<small>State/ Provence: </small>	
							</td>
							<td  align = "left" valign = "top" class = "body2">
					
							<select size="1" name="BusinessState(<%=rowcount%>)">
							<% If Len(BusinessState) > 0 then%>
								<option value="<%=BusinessState%>" selected><%=BusinessState%></option>
							<% Else %>
								<option value="" selected>-----</option>
							<% End If %>
					<option value="AL">AL</option>
					<option  value="AK">AK</option>
					<option  value="AZ">AZ</option>
					<option  value="AR">AR</option>
					<option  value="CA">CA</option>
					<option  value="CO">CO</option>
					<option  value="CT">CT</option>
					<option  value="DE">DE</option>
					<option  value="DC">DC</option>
					<option  value="FL">FL</option>
					<option  value="GA">GA</option>
					<option  value="HI">HI</option>
					<option  value="ID">ID</option>
					<option  value="IL">IL</option>
					<option  value="IN">IN</option>
					<option  value="IA">IA</option>
					<option  value="KS">KS</option>
					<option  value="KY">KY</option>
					<option  value="LA">LA</option>
					<option  value="ME">ME</option>
					<option  value="MD">MD</option>
					<option  value="MA">MA</option>
					<option  value="MI">MI</option>
					<option  value="MN">MN</option>
					<option  value="MS">MS</option>
					<option  value="MO">MO</option>
					<option  value="MT">MT</option>
					<option  value="NE">NE</option>
					<option  value="NV">NV</option>
					<option  value="NH">NH</option>
					<option  value="NJ">NJ</option>
					<option  value="NM">NM</option>
					<option  value="NY">NY</option>
					<option  value="NC">NC</option>
					<option  value="ND">ND</option>
					<option  value="OH">OH</option>
					<option  value="OK">OK</option>
					<option  value="OR">OR</option>
					<option  value="PA">PA</option>
					<option  value="RI">RI</option>
					<option  value="SC">SC</option>
					<option  value="SD">SD</option>
					<option  value="TN">TN</option>
					<option  value="TX">TX</option>
					<option  value="UT">UT</option>
					<option  value="VT">VT</option>
					<option  value="VA">VA</option>
					<option  value="WA">WA</option>
					<option  value="WV">WV</option>
					<option  value="WI">WI</option>
					<option  value="WY">WY</option>
					<option  value=""></option>
					<option  value="ON">ON</option>
					<option  value="QC">QC</option>
					<option  value="BC">BC</option>
					<option  value="AB">AB</option>
					<option  value="MB">MB</option>
					<option  value="SK">SK</option>
					<option  value="NS">NS</option>
					<option  value="NB">NB</option>
					<option  value="NL">NL</option>
					<option  value="PE">PE</option>
					<option  value="NT">NT</option>
					<option  value="YK">YK</option>
					<option  value="NU">NU</option>
				</select>
</td>
</tr>
<tr>
<td  align = "right" class = "body2">
								<small>Country: </small>	
							</td>
							<td  align = "left" valign = "top" class = "body2">
							<select size="1" name="BusinessCountry(<%=rowcount%>)">
							<% if len(BusinessCountry) > 1 then %>
								<option value="<%=BusinessCountry%>" selected><%=BusinessCountry%></option>
						   <% end if %>
							
							<option value="USA" >USA</option>
							<option value="Canada">Canada</option>
					
				</select>
</td>
</tr>

<tr>
							<td   class = "body2" align = "right"><small>Postal Code: </small></td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="BusinessZip(<%=rowcount%>)"  size = "8" value = "<%=BusinessZip%>">
							</td>
</tr>
</table>
</td>
</tr>
</table>


<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
<tr><td colspan = "4" align = "center">

<input type = "hidden" name="TotalCount" value= "<%= rowcount - 1 %>" >
	<input type=submit value = "update" class="regsubmit2" >
</td></tr></table>
</form>

<!--#Include file="970Bottom.asp"-->
<!--#Include virtual="/Footer.asp"--> 

</Body>
</HTML>
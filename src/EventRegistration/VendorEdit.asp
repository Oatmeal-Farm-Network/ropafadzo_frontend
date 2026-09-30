<%@ Language="VBScript" %> 

<html>
<head>
<!--#Include virtual="GlobalVariables.asp"-->
<title>Edit Vendor</title>

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<meta name="author" content="Andresen Events">
<link rel="stylesheet" type="text/css" href="Style.css">

<% message=request.querystring("message")%>
<script type="text/javascript" src="/usableforms.js"></script>
<script language="JavaScript" src="/calendar_us.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>
</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->
<!--#Include virtual="VendorsHeader.asp"-->
 <% PageTitleText = "Edit Vendors"  %>
<!--#Include file="970Top.asp"-->
<table border = "0"  cellpadding=0 cellspacing=0 align = "center" width = "945">
	  <tr><td class = "body2"  ><% if len(message) > 1 then %>
				<h2><font color = "brown"><%= message %></font></h2>
			<% end if %></td></tr>
</table>

<%
VendorID = request.querystring("VendorID")

if len(vendorID) > 0 then %>



<% Set rs2 = Server.CreateObject("ADODB.Recordset")	
sql = "select * from VendorLevels where EventID = " & EventID
rs2.Open sql, conn, 3, 3  
MaxExtraTables= rs2("MaxExtraTables")
rs2.close


sql = "select * from Vendor where EventID = " & EventID & " and VendorID = " & VendorID
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
if rs.eof then 
     %>

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "945" align = "center">
	<tr>
		<td Class = "menu2" >
		You do not currently have any vendors entered. To add vendors <a href = "VendorEdit.asp?EventID=<%=EventID%>" class= "menu2">Add Vendors</a>.
		</td>
	</tr>
</table>

<% else
 Dim name(2000) 
rowcount = rowcount
%>


<form  action="VendorEditHandle.asp" method = "post">
	<input type = "hidden" name="EventID" value= "<%= EventID %>" >
<table width = "750" border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=0>

<%
row = "odd"
rowcount = 1
row = "even"
VendorID= request.querystring("VendorID")
 sql = "select *, Business.AddressID as BusinessAddressID from Vendor, Business, Address, VendorLevels,  BusinessTypeLookup, People, Phone, websites where Vendor.BusinessID = Business.BusinessID and Vendor.AddressID = Address.AddressID and Vendor.VendorlevelID = VendorLevels.VendorlevelID and Business.BusinessTypeID = BusinessTypeLookup.BusinessTypeID and People.BusinessId = Business.BusinessID and Business.PhoneID = Phone.PhoneID and Business.BusinessWebsiteID = Websites.WebsitesID and Vendor.VendorID= " & VendorID & " order by Vendor.EventID Desc"
  'response.write("sql=" & sql )


 Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	
	While Not rs.eof  
	VendorQTYExtraTables = rs("VendorQTYExtraTables")
	VendorID = rs("VendorID")
	BusinessID = rs("BusinessID")
	BusinessAddressID = rs("AddressID")
	VendorlevelID = rs("VendorLevelID")
	VendorStallName = rs("VendorStallName")
	VendorStallDescription = rs("VendorStallDescription")
	VendorStallName = rs("VendorStallName")
	VendorPaidAmount = rs("VendorPaidAmount")
	VendorPaidAmountMonth  = rs("VendorPaidAmountMonth")
	VendorPaidAmountDay = rs("VendorPaidAmountDay")
	VendorPaidAmountYear = rs("VendorPaidAmountYear")

	VendorStallPrice = rs("VendorStallPrice")
	VendorBoothQTY= rs("VendorBoothQTY")
	SpecialRequests= rs("SpecialRequests")
	
	BusinessTypeID = rs("BusinessTypeID")
	BusinessType = rs("BusinessType")
	BusinessName = rs("BusinessName")
	BusinessAddress = rs("AddressStreet")
	BusinessApt = rs("AddressApt")
	BusinessCity = rs("AddressCity")
	BusinessState = rs("AddressState")
	BusinessCountry = rs("Addresscountry")
	BusinessAddressID = rs("BusinessAddressID")
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
	<a name = "<%=VendorID%>"><a>
	<input type = "hidden" name="SponID" value= "<%= SponID %>" >

	<input type = "hidden" name="BusinessWebsiteID" value= "<%= BusinessWebsiteID %>" >
	<input type = "hidden" name="BusinessAddressID" value= "<%= BusinessAddressID %>" >
	<input name="BusinessPhoneID" Value ="<%=BusinessPhoneID%>"  type = "Hidden">
	<input name="BusinessID" Value ="<%=BusinessID%>"  type = "Hidden">
	<input name="PeopleID" Value ="<%=PeopleID%>"  type = "Hidden">
	<input name="VendorID" Value ="<%=VendorID%>"  type = "Hidden">

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

<table width = "340" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center">
<tr><td class = "body2" align = "right" ><small>Vendor Level:&nbsp;</small></td>

	<%
		Set rs2 = Server.CreateObject("ADODB.Recordset")	
		sql = "select * from VendorLevels where EventID = " & EventID
		    rs2.Open sql, conn, 3, 3  
	%> 
  <td  class = "body2" >
			 <select size="1" name="VendorLevelID">
			<% if len(VendorStallName) > 0 then %>
				<option  value="<%=VendorlevelID%>"><%= VendorStallName %></option>
			<% end if %>



			<% While Not rs2.eof  %>
				<option  value="<%=rs2("VendorlevelID")%>"><%=rs2("VendorStallName")%></option>
 			<%  rs2.movenext
  				Wend 
  			%>	
			</select>
		</td>
</tr>
<tr>
	<td class = "body2" align = "right" width = "200"><small>Amount Paid:&nbsp;</small>
	</td>
	<td class = "body2">
		$<input name="VendorPaidAmount" Value ="<%=VendorPaidAmount%>" class="positive" size = "25" maxlength = "8">
		<script type="text/javascript">
			$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
		</script>

	</td>
<tr>	 
<tr>
 <td class = "body2" align = "right"><small>Payment Date:&nbsp;</small>
 </td>
  <td class = "body2">

<select size="1" name="VendorPaidAmountMonth">

		<% if len(VendorPaidAmountMonth) > 0 then %>
					<option value="<%=VendorPaidAmountMonth%>" selected><%=VendorPaidAmountMonth%></option>
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
				<select size="1" name="VendorPaidAmountDay">
		<% if len(VendorPaidAmountDay) > 0 then %>
					<option value="<%=VendorPaidAmountDay%>" selected><%=VendorPaidAmountDay%></option>
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
		<select size="1" name="VendorPaidAmountYear">
				<% if len(VendorPaidAmountYear) > 0 then %>
					<option value="<%=VendorPaidAmountYear%>" selected><%=VendorPaidAmountYear%></option>
					
					<% if not VendorPaidAmountYear = year(now) then%>
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
	<td class = "body2" align = "right" width = "200"><small>Business Name:&nbsp;</small>
	</td>
	<td class = "body2">
		<input name="BusinessName" Value ="<%=BusinessName%>"  size = "26" maxlength = "61">
	 </td>
<tr>	 
<tr>
	<td class = "body2" align = "right" width = "180"><small>Organization's Type:&nbsp;</small></td>
	<td class = "body2">			
						<select size="1" name="BusinessTypeID">
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
<tr><td class = "body2" align = "right"><small>Contact First Name:&nbsp;</small></td>
	<td class = "body2">
		<input name="PeopleFirstName" Value ="<%=PeopleFirstName%>"  size = "26" maxlength = "61">
	</td>
</tr>
 <tr><td class = "body2" align = "right"><small>Contact Last Name:&nbsp;</small></td>
	<td class = "body2">
		<input name="PeopleLastName" Value ="<%=PeopleLastName%>"  size = "26" maxlength = "61">
	</td>
</tr>

<tr>
  <td class = "body2" align = "right"><small>Hours of Operation:&nbsp;</small></td>
<td class = "body2">
	<input name="BusinessHours" Value ="<%=BusinessHours%>"  size = "26" maxlength = "61">
</td>
</tr>

	 
</table>


</td>
<td valign = "top">	 
<table cellpadding = "0" cellspacing = "0" border = "0">
<tr>
	<td class = "body2" colspan = "2"><small>Number of Vendor Booths:&nbsp;</small>
	<select size="1" name="VendorBoothQTY">
	<option value= "<%=VendorBoothQTY%>"><%=VendorBoothQTY%></option>
	
	<% for x = 1 to 20 %>
	<option value= "<%=x%>"><%=x%></option>
 	<% next %>
 </select>
		
		
	</td>
</tr>
<tr>
	<td class = "body2" colspan = "2"><small>Number of Extra Tables:</small>
	
	<% x = 0
	   if len(MaxExtraTables) > 0 then
	   else
	   MaxExtraTables = 6
	   end if 
%>
<select size="1" name="VendorQTYExtraTables">
	<option value= "<%=VendorQTYExtraTables%>"><%=VendorQTYExtraTables%></option>
<%	for x = 1 to MaxExtraTables %>
	<option value= "<%=x%>"><%=x%></option>
 	<% next %>
 </select>
		
		
	</td>
</tr>


<tr>
	<td class = "body2" align = "right"><small>Email:*&nbsp;</small></td>
	<td class = "body2">
		<input name="BusinessEmail" Value ="<%=BusinessEmail%>"  size = "26" maxlength = "61">
	</td>
</tr>	 
<tr>	 
  <td class = "body2" align = "right"><small>Website:&nbsp;</small></td>
   <td class = "body2">
		<small>http://</small><input name="BusinessWebsite" Value ="<%=BusinessWebsite%>"  size = "20" maxlength = "61">
	</td>
</tr>
<tr>					
	<td   class = "body2" align = "right">
								<small>Phone:&nbsp;</small>
							</td>
							<td  align = "left" valign = "top" class = "body2">
							
								<input name="BusinessPhone"  size = "26" value = "<%=BusinessPhone%>">
							</td>
</tr>

<tr>
	<td   class = "body2" align = "right">
		<small>Cell:&nbsp;</small>
	</td>
	<td  align = "left" valign = "top" class = "body2">
		<input name="BusinessCell"  size = "26" value = "<%=BusinessCell%>">
</td>	
</tr>
<tr>
	<td   class = "body2" align = "right"><small>Fax:&nbsp;</small></td>
	<td  align = "left" valign = "top" class = "body2"><input name="BusinessFax"  size = "26" value = "<%=BusinessFax%>"></td>
</tr>

</table>
</td>
<td valign = "top">	 
<table cellpadding = "0" cellspacing = "0" border = "0">
<tr>
<td   class = "body2" align = "right">
	<small>Street:&nbsp;</small>
</td>
<td  align = "left" valign = "top" class = "body2">
	<input name="BusinessAddress"  size = "26" value = "<%=BusinessAddress%>">
</td>
</tr>
<tr>
	<td   class = "body2"  align = "right">
		<small>Apartment/Suite:&nbsp; </small>
</td>
	<td  valign = "top" class = "body2">
		<input name="BusinessApt"  size = "26" value = "<%=BusinessApt%>">
	</td>
</tr>
<tr>
	<td   class = "body2" align = "right">
		<small>City:&nbsp;</small>
	</td>
	<td  valign = "top" class = "body2">
		<input name="BusinessCity"  size = "26" value = "<%=BusinessCity%>">
	</td>
</tr>
<tr>
<td  align = "right" class = "body2">
								<small>State/Provence:&nbsp; </small>	
							</td>
							<td  align = "left" valign = "top" class = "body2">
					
							<select size="1" name="BusinessState">
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
								<small>Country:&nbsp; </small>	
							</td>
							<td  align = "left" valign = "top" class = "body2">
					
							<select size="1" name="BusinessCountry">
							<% if len(BusinessCountry) > 1 then %>
								<option value="<%=BusinessCountry%>" selected><%=BusinessCountry%></option>
						   <% end if %>
							
							<option value="USA" >USA</option>
							<option value="Canada">Canada</option>
					
				</select>
</tr>

<tr>
			<td   class = "body2" align = "right"><small>Postal Code:&nbsp; </small></td>
			<td  align = "left" valign = "top" class = "body2">
				<input name="BusinessZip"  size = "8" value = "<%=BusinessZip%>">
			</td>
</tr>
</table>
</td>
</tr>
<tr>
	<td class = "body"  colspan = "6">
	<table cellpadding = "0" cellspacing = "0" width = "900"><tr><td width = "170" class = "body" align = "right" valign = "top">
<small>Special Requests: </small></td>
	<td class ="body2" valign = "top"  >
	<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>
<script language="javascript1.2">
// attach the editor to the textarea with the identifier 'textarea1'.
WYSIWYG.attach("SpecialRequests");
</script> 
<TEXTAREA NAME="SpecialRequests" cols="80" rows="4" wrap="file" ><%=SpecialRequests%></textarea><br>
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
	<input type=submit value = "update" class="regsubmit2">
</td></tr></table>
</form>

<% end if %>

<% else %>	
<table border = "0"  cellpadding=0 cellspacing=0 width = "900" align = "center" >
 <% sql = "select * from Vendor  where EventID = " & EventID
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 
    if  rs.eof then %>
	<tr><td class = "body">Currently you do not have any vendors listed. To add vendors please select  <a href = "VendorAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Vendors</a>.</td></tr>

<% else %>

<tr><td class = "body" colspan = "4">
Please select a vendor to be edited:
</td></tr> 
<% end if %>
</table>
<% 
dim VendorIDArray(10000)
dim InstructorPeopleIDArray(10000)
sql = "select * from VendorLevels  where EventID = " & EventID

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
if  rs.eof then 
noVendors = True %>


<tr>
   <td   class = "menu2">
   
    <% sql = "select * from VendorLevels  where EventID = " & EventID

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 
    if  rs.eof then %>
	No vendor options have been added yet. To add vendor options please select  <a href = "Vendorspagedata.asp?EventID=<%=EventID%>" class = "menu2">Add Vendor Options</a>.<br>

   	<% end if 
   	rs.close
   	
   	if noVendors = True then
   	%>
  <br>
   Currently you do not have any vendors listed. To add vendors please select  <a href = "VendorAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Vendors</a>.
   <% end if %>
   </td>
 </tr>
</table>

<% else 

x = 0

 sql = "select * from Vendor, Business, Address, VendorLevels, BusinessTypeLookup, People, Phone, websites where Vendor.BusinessID = Business.BusinessID and Vendor.AddressID = Address.AddressID and Vendor.VendorlevelID = VendorLevels.VendorlevelID and Business.BusinessTypeID = BusinessTypeLookup.BusinessTypeID and People.BusinessId = Business.BusinessID and Business.PhoneID = Phone.PhoneID and Business.BusinessWebsiteID = Websites.WebsitesID and Vendor.EventID = " & EventID & " order by Vendor.EventID Desc"

'response.write("sql = " & sql & "<br/>")
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then %>



<table border = "0" cellpadding=0 cellspacing=0 width = "900" align = "center">
<tr bgcolor = "#DBF5F3"><td class="Menu2" align = "center" width = "40"><b>QTY</b></td>
<td class="Menu2" align = "left" width = "550"><b>Vendor</b></td>
<td class="Menu2" align = "center" width = "140"><b>Vendor Level</b></td>
<td class="Menu2" align = "center" width = "110"><b>Options</b></td></tr>
<tr><td class = "Menu2" colspan= "4" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
</table>


<% 
	While Not rs.eof  

	VendorID = rs("VendorID")
	BusinessID = rs("BusinessID")
	BusinessAddressID = rs("AddressID")
	'response.write("VendorID = " & VendorID &  "<br/>")
	'response.write("BusinessID = " & BusinessID & " AddressID = " & AddressID & "<br/>")
	VendorlevelID = rs("VendorLevelID")
	VendorLevelName = rs("VendorLevelName")
	VendorStallName = rs("VendorStallName")
	VendorStallDescription = rs("VendorStallDescription")
	VendorStallName = rs("VendorStallName")
	VendorPaidAmount = rs("VendorPaidAmount")
	VendorPaidAmountMonth  = rs("VendorPaidAmountMonth")
	VendorPaidAmountDay = rs("VendorPaidAmountDay")
	VendorPaidAmountYear = rs("VendorPaidAmountYear")

	VendorStallPrice = rs("VendorStallPrice")
	VendorBoothQTY= rs("VendorBoothQTY")
	BusinessTypeID = rs("BusinessTypeID")
	BusinessName = rs("BusinessName")
	PeopleID = rs("PeopleID")
	

x = x + 1

  If row = "even" Then
		row = "odd"
	Else
		row = "even"
	End if
 If row = "even" Then %>
	<table border = "0" width = "900"  align = "center" bgcolor = "white">

<% Else %>
	<table border = "0" width = "900"  align = "center" bgcolor = "#DEF6F3" >

<% End If %>

<tr>
<td class = "menu2" width = "40"><a href = "VendorEdit.asp?VendorID=<%=VendorID%>" class="menu2"><%=VendorBoothQTY %></a></td>
<td class = "menu2" width = "550"><a href = "VendorEdit.asp?VendorID=<%=VendorID%>" class="menu2"><%=BusinessName %></a></td>
<td class = "menu2" width = "150" align = "left"><a href = "Vendorspagedata.asp?EventID=<%=eventID%>#Edit" class="menu2"><%=VendorStallName %></a></td>
<td class="body2" align = "center" width = "110">
	      <a href = "VendorEdit.asp?VendorID=<%=VendorID%>&EventID=<%=EventID%>#Edit" class="menu2"><img src = "images/Edit.gif" width = "15" border = "0" alt = "Edit Vendor"></a>&nbsp;&nbsp;&nbsp; 
	      <a href = "VendorDeleteHandleForm.asp?VendorID=<%=VendorID%>&EventID=<%=EventID%>"><img src = "images/delete.jpg" width = "15" border = "0" alt = "Delete Vendor"></a>&nbsp;&nbsp;&nbsp;
	     </td>

</tr>


<% rs.movenext
wend %>
</table>
<% end if %>

<% end if %>


<% end if %>


<!--#Include file="970Bottom.asp"-->
<!--#Include virtual="/Footer.asp"--> 

</Body>
</HTML>
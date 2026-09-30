<a name= "Classes">
<table border = "0"  cellpadding=0 cellspacing=0 width = "900" align = "center" >
	<tr>
	   <td  valign = "top"   colspan = "3"><h2>Vendors Overview</h2></td>
	</tr>
	<tr><td class = "body2" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	<tr><td class = "body2" height = "10"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
	 <tr>
         	 	<%
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
  
   Currently you do not have any vendors listed. To add vendors please select  <a href = "VendorAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Vendors</a>.
   <% end if %>
   </td>
 </tr>


<% else %>


	 <tr>
   <td   class = "menu2"><img src = "images/px.gif" width = "20" height = "20" >
	 Vendors Overview | 
	 <a href = "Vendorspagedata.asp?EventID=<%=eventID%>" class = "menu2">Add Vendor Options</a> |
     <a href = "Vendorspagedata.asp?EventID=<%=eventID%>#Edit" class = "menu2">Edit Vendor Options</a> |
 	 <a href = "VendorAdd.asp?EventID=<%=EventID%>" class = "menu2">Add Vendors</a> |&nbsp; 

<%

x = 0

 sql = "select * from Vendor, Business, Address, VendorLevels, BusinessTypeLookup, People, Phone, websites where Vendor.BusinessID = Business.BusinessID and Vendor.AddressID = Address.AddressID and Vendor.VendorlevelID = VendorLevels.VendorlevelID and Business.BusinessTypeID = BusinessTypeLookup.BusinessTypeID and People.BusinessId = Business.BusinessID and Business.PhoneID = Phone.PhoneID and Business.BusinessWebsiteID = Websites.WebsitesID and Vendor.EventID = " & EventID & " order by Vendor.EventID Desc"

'response.write("sql = " & sql & "<br/>")
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then %>
	<table border = "0" width = "900"  align = "center" bgcolor = "#DEF6F3" >
<tr>
<td class = "body2" align = "center"width = "125"><b>Vendor</b></td>
<td class = "body2" align = "center"width = "125"><b>Vendor Level</b></td>
<td class = "body2" align = "center" width = "150"><b>Contact First Name</b></td>
<td class = "body2" align = "center" width = "100"><b>Contact Last Name</b></td>
<td class = "body2" align = "center" width = "130"><b>Actions</b></td>
</tr>
</table>

	
	
<%	end if 
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
	'response.write("In VendorEdit VendorBoothQty = " & VendorBoothQTY & "<br/>")
	SpecialRequests= rs("SpecialRequests")
	
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
<td class = "menu2" width = "125"><a href = "VendorEdit.asp?VendorID=<%=VendorID%>" class="menu2"><%=BusinessName %></a></td>
<td class = "menu2" width = "125" align = "left"><a href = "Vendorspagedata.asp?EventID=<%=eventID%>#Edit" class="menu2"><%=VendorLevelName %></a></td>
<td class = "menu2" width = "150" align = "left"><a href = "VendorEdit.asp?VendorID=<%=VendorID%>" class="menu2"><%=PeopleFirstName %></a></td>
<td class = "menu2" align = "center" width = "100"><a href = "VendorEdit.asp?VendorID=<%=VendorID%>" class="menu2"><%=PeopleLastName%></a></td>
<td class="body2" align = "center" width = "130">
	      <a href = "ClassesEditDetails.asp?VendorID=<%=VendorIDArray(x)%>"><img src = "images/Edit.gif" width = "15" border = "0" alt = "Edit Class"></a>&nbsp;&nbsp;&nbsp; 
	      <a href = "ClassesDeleteHandleForm0.asp?VendorID=<%=VendorIDArray(x)%>&EventID=<%=EventID%>"><img src = "images/delete.jpg" width = "15" border = "0" alt = "Delete Class"></a>&nbsp;&nbsp;&nbsp;
		 <a href = "ClassesEditInstructorsDetails.asp?PeopleID=<%=instructorPeopleIDArray(x)%>" class="menu2"><img src = "images/instructor.jpg" width = "15" border = "0" alt = "Edit Instructor"></a>&nbsp;&nbsp;&nbsp;
		  <a href = "StudentsEdit.asp?EventID=<%=EventID%>"><img src = "images/Student.jpg" width = "15" border = "0" alt = "Edit Student"></a> 
	     </td>

</tr>
</table>

<% wend 

end if %>

<br><br>
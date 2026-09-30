<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Create Event</title>
<meta http-equiv="Content-Language" content="en-us">
<meta name="author" content="The Andresen Group"/>
<link rel="stylesheet" type="text/css" href="/style.css" />


<SCRIPT LANGUAGE="JavaScript">
function verify() {
var themessage = "Please fill out the following fields: \r";
if (document.form.EventTypeID.value=="") {
themessage = themessage + " - Event Type \r";
}
if (document.form.EventName.value=="") {
themessage = themessage + " - Event Name \r";
}
if (document.form.EventStartMonth.value=="") {
themessage = themessage + " - Event Start Month \r";
}

if (document.form.EventStartDay.value=="") {
themessage = themessage + " - Event Start Day \r";
}

if (document.form.EventStartYear.value=="") {
themessage = themessage + " - Event Start Year \r";
}



//alert if fields are empty and cancel form submit
if (themessage == "Please fill out the following fields: \r") {
document.form.submit();
}
else {
alert(themessage);
return false;
   }
}
//  End -->
</script>


<% 

EventID = request.querystring("EventID")
if len(EventID) < 1 then
  EventID = Session("EventID")

	if len(EventID) < 1 then
  	EventID= request.form("EventID")
	end if
end if


  Edit = True

If Edit = "True" then

sqlA =  "Select * from PaymentOptions where EventID= " & EventID & " order by  PaymentOptionsID DESC "
Set rsA = Server.CreateObject("ADODB.Recordset")
rsA.Open sqlA, conn, 3, 3 
	
if Not rsA.eof  Then

   Checks  = rsA("Checks")
   Paypal  = rsA("Paypal")
   PaypalEmail = rsA("PaypalEmail")
   Checkaddress = rsA("Checkaddress")
   PaymentName = rsA("PaymentName")
   PaymentStreet = rsA("PaymentStreet")
   PaymentStreet2 = rsA("PaymentStreet2")
   PaymentCity = rsA("PaymentCity")
   PaymentState = rsA("PaymentState")
   PaymentZip= rsA("PaymentZip")
   PaymentOptionsID = rsA("PaymentOptionsID")
   PaymentCountry = rsA("PaymentCountry")
   
end if

				
sql2 = "select * from event, address, websites where Event.EventID= " & EventID & "  and Event.WebsiteID = Websites.WebsitesID and event.addressid = address.addressid "
response.write("sql2=" & sql2)
acounter = 1
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
	
if Not rs2.eof  Then
EventLocationID = rs2("EventLocationID")

PeopleID = rs2("PeopleID")
EventName = rs2("EventName")
EventTypeID = rs2("EventTypeID")
AddressID = rs2("AddressID")
BusinessID = rs2("BusinessID")
WebsiteID = rs2("WebsiteID")
BusinessID = rs2("BusinessID")
EventAddressID = rs2("AddressID")
EventStartMonth = rs2("EventStartMonth")
EventStartDay = rs2("EventStartDay")
EventStartYear = rs2("EventStartYear")
EventEndMonth = rs2("EventEndMonth")
EventEndDay = rs2("EventEndDay")
EventWebsite = rs2("Website")
EventWebsiteID = rs2("WebsiteID")
EventDescription = rs2("EventDescription")
end if	

	sql2 = "select * from Business where BusinessID= " & BusinessID 

acounter = 1
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
	
if Not rs2.eof  Then
BusinessName = rs2("BusinessName")
BusinessWebsiteID = rs2("BusinessWebsiteID")
BusinessEmail = rs2("BusinessEmail")
BusinessHours = rs2("BusinessHours")
BusinessPhoneID = rs2("PhoneID")
BusinessAddressID = rs2("AddressID")
BusinessTypeID = rs2("BusinessTypeID")
end if	

rs2.close
	
	sql2 = "select AddressID from EventLocation where EventLocationID = " & EventLocationID

acounter = 1
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
   EventAddressID = rs2("AddressID")
rs2.close

	
	
sql2 = "select * from address where AddressID = " & BusinessAddressID

acounter = 1
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
	
if Not rs2.eof  Then
EventLocationStreet = rs2("AddressStreet")
EventLocationApt= rs2("AddressApt")
EventLocationCity = rs2("AddressCity")
EventLocationState = rs2("AddressState")
EventLocationCountry = rs2("AddressCountry")
EventLocationZip = rs2("AddressZip")
end if	

rs2.close
	
sql2 = "select * from websites where WebsitesID = " & BusinessWebsiteID

acounter = 1
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
	
if Not rs2.eof  Then
BusinessWebsite = rs2("Website")
end if	

rs2.close

sql2 = "select * from  phone where PhoneID = " & BusinessPhoneID


acounter = 1
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
	
if Not rs2.eof  Then
BusinessPhone = rs2("Phone")
BusinessCell = rs2("CellPhone")
BusinessFax = rs2("Fax")
end if	

rs2.close
sql2 = "select * from websites where WebsitesID = " & BusinessWebsiteID
acounter = 1
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
	
if Not rs2.eof  Then
BusinessWebsite = rs2("Website")
end if	
rs2.close



sql2 = "select Event.*, EventLocation.*,  address.*, Phone.*, Websites.*  from Event, EventLocation,  address, Phone, Websites where EventLocation.WebsiteID = Websites.WebsitesID and Event.EventLocationID = Eventlocation.EventLocationID and EventLocation.AddressID = Address.AddressID  and Eventlocation.PhoneID = Phone.PhoneID and event.eventid = " & eventid 

acounter = 1
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
	
if Not rs2.eof  Then
EventLocationWebsite = rs2("Website")
EventLocationWebsiteID = rs2("WebsiteID")
EventLocationStreet = rs2("AddressStreet")

EventLocationApt= rs2("AddressApt")
EventLocationCity = rs2("AddressCity")
EventLocationState = rs2("AddressState")
EventLocationCountry = rs2("AddressCountry")
EventLocationZip = rs2("AddressZip")
EventLocationPhone = rs2("Phone")
EventLocationPhoneID = rs2("PhoneID")
EventLocationCell = rs2("CellPhone")
EventLocationFax = rs2("Fax")
EventEndYear = rs2("EventEndYear")
EventLocationID = rs2("EventLocationID")
EventLocationName = rs2("EventLocationName")


EventLocationHours = rs2("EventLocationHours")
EventLocationEmail = rs2("EventLocationEmail")
EventLocationAddressID = rs2("AddressID")

end if	


		
sql2 = "select * from address where AddressID = " & EventLocationAddressID
acounter = 1
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
	
if Not rs2.eof  Then
EventAddress = rs2("AddressStreet")
BusinessApt= rs2("AddressApt")
BusinessCity = rs2("AddressCity")
BusinessState = rs2("AddressState")
BusinessCountry = rs2("AddressCountry")
BusinessZip = rs2("AddressZip")
end if	

rs2.close


'****************************************************************************************************
'  FIND THE EVENT TYPE
'****************************************************************************************************

sql = "select EventType from EventTypesLookup where EventTypeID = " & EventTypeID   & ";" 

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	EventType = rs("EventType")
End If 

rs.close

'****************************************************************************************************
'  FIND THE BUSINESS TYPE
'****************************************************************************************************

sql = "select BusinessType from BusinessTypeLookup where BusinessTypeID = " & BusinessTypeID   & " order by BusinessType Desc;" 

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If Not rs.eof Then
	BusinessType = rs("BusinessType")
End If 

rs.close



end if 	

%>
</head>
<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>
<!--#Include file="AdminEventsHeader.asp"-->
<% Current = "Dashboard"%>
<!--#Include file="OverviewHeader.asp"-->
<!--#Include file="Scripts.asp"-->
<br>

<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "890"><tr><td class = "roundedtop" align = "left">
		<H1>Event Facts</H1>
</td></tr>
<tr><td class = "roundedBottom">

<form  name=form method="post" action="EditEvent2.asp?EventID=<%=EventID%>">

<table border = "0"  cellpadding=5 cellspacing=5 width = "890" align = "center" >
	<tr>
		<td class ="body2" valign = "top" colspan = "2" >* Required fields</td>
	</tr>
	<tr>
	   <td width = "420" valign = "top">
	
	<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "420" ><tr><td class = "roundedtop" align = "left">
		<H1>A Little About Your Event</H1>
</td></tr>
<tr><td class = "roundedBottom">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "420" align = "center" height = "160">

	<tr>
				<td  class = "body2" align = "right" width = "200">
					Event Type:
				</td>
				<td class = "body2" align="left" >
				<% alloweventtypechange = false
				if alloweventtypechange = false then %>
				<%=EventType %>
				<input name="EventTypeID" Value ="<%=EventTypeID %>"  type = "hidden">
				
				 <% else %>
					<select size="1" name="EventTypeID">
					<% if len(EventType) > 1 then %>
					  	<option value= "<%=EventTypeID %>"><%=EventType %></option>
					 <% end if %>
<% 
  sql = "select * from EventTypesLookup"
  Set rs = Server.CreateObject("ADODB.Recordset")
  rs.Open sql, conn, 3, 3   
  if not rs.eof then
  while not rs.eof %>
  
		<option value= "<%=rs("EventTypeID") %>"><%=rs("EventType") %></option>
<% 
  rs.movenext
  wend 
end if 


end if
%>
 </select>
    	</td>
	</tr>
	<tr>
		<td class = "body2" align = "right">
			Event Name:*&nbsp; 

		</td>
		<td class = "body2" align="left">
			<input name="EventName" Value ="<%=EventName%>"  size = "43" maxlength = "61">
		</td>
</tr>
	<tr>
		<td class = "body2" align = "right">
			Start Date:* &nbsp;</td>
		<td align="left">
				<select size="1" name="EventStartMonth">
				<% if len(EventStartMonth) > 0 then %>
					<option value="<%=EventStartMonth%>" selected><%=EventStartMonth%></option>
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
				<select size="1" name="EventStartDay">
				<% if len(EventStartDay) > 0 then %>
					<option value="<%=EventStartDay%>" selected><%=EventStartDay%></option>
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
		<select size="1" name="EventStartYear">
					<% if len(EventStartMonth) > 0 then %>
					<option value="<%=EventStartYear%>" selected><%=EventStartYear%></option>
				<% else %>
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

					
					
				
			<% currentyear = year(date) 
					For yearv=currentyear To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
		</td>
	   </tr>
	   <tr>
		<td class = "body2" align = "right">
			End Date: &nbsp;</td>
		<td align="left">
		<select size="1" name="EventEndMonth">

		<% if len(EventEndMonth) > 0 then %>
					<option value="<%=EventEndMonth%>" selected><%=EventEndMonth%></option>
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
				<select size="1" name="EventEndDay">
		<% if len(EventEndDay) > 0 then %>
					<option value="<%=EventEndDay%>" selected><%=EventEndDay%></option>
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
		<select size="1" name="EventEndYear">
				<% if len(EventEndYear) > 0 then %>
					<option value="<%=EventEndYear%>" selected><%=EventEndYear%></option>
				<% else %>
					<option value="<%=year(now)%>" selected><%=year(now)%></option>
				<% end if %>

					
				
			<% currentyear = year(date) 
						For yearv=currentyear To currentyear + 5%>
					<option value="<%=yearv%>"><%=yearv%></option>		
					<% Next %></select>
		</td>
	   </tr>
	   <tr>
		<td class = "body2" align = "right">
			Event Website: &nbsp;
		</td>
		<td class = "body2" align="left">
			<input name="EventWebsiteID" Value ="<%=EventWebsiteID%>"  type = "Hidden">
			http://<input name="EventWebsite" Value ="<%=EventWebsite%>"  size = "23" maxlength = "61">
		</td>
</tr>
</table>
  		</td>
</tr>
</table>
      

        <br>
        	<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "450"><tr><td class = "roundedtop" align = "left">
		<H1>Event Location</H1>
</td></tr>
<tr><td class = "roundedBottom">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "420" height = "200" align = "center">

						<tr>
							<td class = "body2" align = "right" width = "200">
								<div align = 'right'>Name of Location: &nbsp;</div>
							</td>
							<td class = "body2" align = "left" >
					<input name="EventLocationName" Value ="<%=EventLocationName%>"  size = "30" maxlength = "61">

							</td>
						</tr>
						<tr>
							<td class = "body2" align = "right">
								<div align = 'right'>Street: &nbsp;</div>
							</td>
							<td class = "body2" align="left">
							<input name="EventLocationAddressID" Value ="<%=EventLocationAddressID%>"  type = "Hidden">

									<input name="EventLocationStreet" Value ="<%=EventLocationStreet%>"  size = "23" maxlength = "61">
							</td>
						</tr>
						<tr>
							<td class = "body2" align = "right">
								<div align = 'right'>Apartment / Suite: &nbsp;</div>
							</td>
							<td class = "body2" align="left">
									<input name="EventLocationApt" Value ="<%=EventLocationApt%>"  size = "23" maxlength = "61">
							</td>
						</tr>
						<tr>
							<td class = "body2" align = "right">
								<div align = 'right'>City: &nbsp;</div>
							</td>
							<td class = "body2" align="left">
									<input name="EventLocationCity" Value ="<%=EventLocationCity%>"  size = "23" maxlength = "61">
							</td>
						</tr>

						<tr>
							<td  align = "right" class = "body2">
								<div align = 'right'>State/ Provence: &nbsp;</div>
							</td>
							<td  align = "left" valign = "top" class = "body2">
					
							<select size="1" name="EventLocationState">
							<% If Len(EventLocationState) > 0 then%>
								<option value="<%=EventLocationState%>" selected><%=EventLocationState%></option>
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
								<div align = 'right'>Country:  &nbsp;</div>
					</td>
					<td  align = "left" valign = "top" class = "body2">
						<select size="1" name="EventLocationCountry">
						 <% if EventLocationCountry="Canada" then %>
						 	<option value="USA" >USA</option>
							<option value="Canada" selected>Canada</option>
						<% else %>
							<option value="USA" selected>USA</option>
							<option value="Canada">Canada</option>
						 <% end if %>
					
				        </select>
					</td>
					</tr>

					<tr>
							<td   class = "body2" align = "right">
								<div align = 'right'>Postal Code: &nbsp;</div>
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="EventLocationZip"  size = "8" value = "<%=EventLocationZip%>">
							</td>
						</tr>
				<tr>
							<td   class = "body2" align = "right">
								 &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
								
		</td>
	</tr>
</table>
		</td>
	</tr>
</table>
       </td>	
	   <td width = "450" valign = "top">
	   <% if not EventTypeID =5 then %> 
		<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "420"><tr><td class = "roundedtop" align = "left">
		<H1>Payment Options</H1>
</td></tr>
<tr><td class = "roundedBottom">	
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "420" align = "center" height = "270">
	<tr>			
				  <td  colspan = "2" class = "body2" align="left">
				     In what different ways will you accept payment:
				  </td>
				 </tr>
					<tr>
						<td class = "body2" colspan = "2" align="left">
						<% if PayPal = True then
						    PayPalCheck = "checked"
						   else
						   	PayPalCheck = ""
						   end if 
						   
						   if Checks = True then
						    ChecksCheck = "checked"
						   else
						   	ChecksCheck = ""
						   end if
						   %>
									<input name="PaymentOptionsID" Value ="<%=PaymentOptionsID%>"  type = "hidden"><br>
							<input type="checkbox" name="PayPal"  <%=PayPalCheck %> >Paypal<br>
							<img src = "images/px.gif" width = "20" height = "1">Paypal Email Address: &nbsp;
					
								<input name="PaypalEmail" Value ="<%=PaypalEmail%>"  size = "33" ><br>
								<img src = "images/px.gif" width = "20" height = "1"><small>This is the email address associated with your Paypal account.</small>
							</td>
						</tr>
						<tr>
						<td class = "body2" colspan = "2" align="left">
								<input type="checkbox" name="Checks"  <%=ChecksCheck%> >Check<br>
								<img src = "images/px.gif" width = "20" height = "1">Pay To: <input name="PaymentName"  size = "30" value = "<%=PaymentName%>"><br>
						

							</td>
						</tr>
					<tr>
						  <td   class = "body2" colspan = "2" align="left">
								<img src = "images/px.gif" width = "20" height = "1">Address that the check should be sent to:
							</td>
						</tr>

					<tr>
						  <td   class = "body2" align = "right">
								<div align = "right">Street: &nbsp;</div>
							</td>

							<td  align = "left" valign = "top" class = "body2">
								<input name="PaymentStreet"  size = "30" value = "<%=PaymentStreet%>">
							</td>
						</tr>
						<tr>
						<td   class = "body2"  align = "right">
								<div align = "right">Apartment / Suite: &nbsp;</div>
						</td>
						<td  valign = "top" class = "body2" align="left">
								<input name="PaymentStreet2"  size = "30" value = "<%=PaymentStreet2%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								<div align = "right">City: &nbsp;</div>
							</td>
							<td  valign = "top" class = "body2" align="left">
								<input name="PaymentCity"  size = "30" value = "<%=PaymentCity%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								<div align = "right"><img src = "images/px.gif" width = "22" height = "1">State / Provence: &nbsp;</div>
					</td>
							<td  valign = "top" class = "body2" align="left">
							<select size="1" name="PaymentState">
							<% If Len(PaymentState) > 0 then%>
								<option value="<%=PaymentState%>" selected><%=PaymentState%></option>
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
							<td   class = "body2" align = "right">
								<div align = "right">Postal Code: &nbsp;</div>
							</td>
							<td  valign = "top" class = "body2" align="left">
								<input name="PaymentZip"  size = "12" value = "<%=PaymentZip%>">
							</td>
						</tr>
				<tr>
					<td  align = "right" class = "body2">
								<div align = "right">Country:  &nbsp;</div>
					</td>
					<td  align = "left" valign = "top" class = "body2">
						<select size="1" name="PaymentCountry">
						<% if PaymentCountry="Canada" then %>
						 	<option value="USA" >USA</option>
							<option value="Canada" selected>Canada</option>
						<% else %>
							<option value="USA" selected>USA</option>
							<option value="Canada">Canada</option>
						 <% end if %>
					
				        </select>
					</td>
					</tr>
</table>
			</td>
		</tr>
</table>

<br>
<% end if %>
	<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "420"><tr><td class = "roundedtop" align = "left">
		<H1>Who is Putting on the Event?</H1>
</td></tr>
<tr><td class = "roundedBottom">	
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "420" align = "center" height = "300">
	<tr>			
				  <td  colspan = "2" class = "body2">
				     Please enter below information about the association or business that is hosting the event, if applicable.
				  </td>
				 </tr>
					<tr>
						<td class = "body2" align = "right" width = "200">
							<div align = "right">Organization's Name: &nbsp;</div>
						</td>
						<td class = "body2" align="left">
							<input name="BusinessName" Value ="<%=BusinessName%>"  size = "23" maxlength = "61">
						</td>
					</tr>
					<tr>
						<td class = "body2" align = "right">
							<div align = "right">Organization's Type: &nbsp;</div>
						</td>
						<td class = "body2" align="left">
									
						<select size="1" name="BusinessTypeID">
						<% if len(BusinessType) > 1 then %>
						    <option value= "<%=BusinessTypeID %>"><%=BusinessType %></option>
						<%end if %>
						<option value= "2">N/A</option>
<% 
  sql = "select * from BusinessTypeLookup where not BusinessTypeID = 2 "
  Set rs = Server.CreateObject("ADODB.Recordset")
  rs.Open sql, conn, 3, 3   
  if not rs.eof then
  while not rs.eof %>
  
		<option value= "<%=rs("BusinessTypeID") %>"><%=rs("BusinessType") %></option>
<% 
  rs.movenext
  wend 
end if %>
 </select>
			
							</td>
					</tr>
					<tr>
						<td class = "body2" align = "right">
							<div align = "right">Website: &nbsp;</div>
						</td>
						<td class = "body2" align="left">
								<input name="BusinessWebsiteID" Value ="<%=BusinessWebsiteID%>"  type = "Hidden">
									http://<input name="BusinessWebsite" Value ="<%=BusinessWebsite%>"  size = "23" maxlength = "61">
							</td>
						</tr>
					<tr>
							<td class = "body2" align = "right">
								<div align = "right">Contact Email: &nbsp;</div>
							</td>
						<td class = "body2" align="left">
									<input name="BusinessEmail" Value ="<%=BusinessEmail%>"  size = "23" maxlength = "61">
						</td>

					<tr>
						  <td   class = "body2" align = "right">
								<div align = "right">Street: &nbsp;</div>
							</td>

							<td  align = "left" valign = "top" class = "body2">
							<input name="BusinessAddress" Value ="<%=BusinessAddress%>"  type = "Hidden">
								<input name="BusinessAddress"  size = "30" value = "<%=BusinessAddress%>">
							</td>
						</tr>
						<tr>
						<td   class = "body2"  align = "right">
								<div align = "right">Apartment / Suite: &nbsp;</div>
						</td>
						<td  valign = "top" class = "body2" align="left">
								<input name="BusinessApt"  size = "30" value = "<%=BusinessApt%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								<div align = "right">City: &nbsp;</div>
							</td>
							<td  valign = "top" class = "body2" align="left">
								<input name="BusinessCity"  size = "30" value = "<%=BusinessCity%>">
							</td>
						</tr>
						<tr>
							<td  align = "right" class = "body2">
								<div align = "right">State/ Provence: &nbsp;</div>
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
								<div align = "right">Country:  &nbsp;</div>
					</td>
					<td  align = "left" valign = "top" class = "body2">
						<select size="1" name="BusinessCountry">
						<% if BusinessCountry="Canada" then %>
						 	<option value="USA" >USA</option>
							<option value="Canada" selected>Canada</option>
						<% else %>
							<option value="USA" selected>USA</option>
							<option value="Canada">Canada</option>
						 <% end if %>
				        </select>
					</td>
					</tr>

						<tr>
							<td   class = "body2" align = "right">
								<div align = "right">Postal Code: &nbsp;</div>
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="BusinessZip"  size = "8" value = "<%=BusinessZip%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								<div align = "right">Phone: &nbsp;</div>
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="BusinessPhoneID" Value ="<%=BusinessPhoneID%>"  type = "Hidden">
								<input name="BusinessPhone"  size = "30" value = "<%=BusinessPhone%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								<div align = "right">Cell: &nbsp;</div>
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="BusinessCell"  size = "30" value = "<%=BusinessCell%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								<div align = "right">Fax: &nbsp;</div>
							</td>
							<td  align = "left" valign = "top" class = "body2">
								<input name="BusinessFax"  size = "30" value = "<%=BusinessFax%>">
								<input name="BusinessID" Value ="<%=BusinessID%>"  type = "Hidden">

					</td>
				</tr>
		</table>
	</td>
</tr>
</table>
</td>
</tr>
</table>

<table width = "975"  align = "center"  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<tr>
	<td class ="body2" valign = "top"  align = "center" height = "20"><br>
	<input name="EventID"  type = "hidden" value = "<%=EventID%>">
	<input name="PeopleID"  type = "hidden" value = "<%=PeopleID%>">
		<input name="EventLocationID"  type = "hidden" value = "<%=EventLocationID%>">

	<input name="Edit"  type = "hidden" value = "<%=Edit%>">

		<center><input type=submit value="Update"  class = "regsubmit2" ></center>

	</td>
</tr>
</table>
		
					
 </form> 
 </td>
</tr>
</table>
	</td>
</tr>
</table><br>
	

<!--#Include virtual="Footer.asp"--> 
</body>
</HTML>
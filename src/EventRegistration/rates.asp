<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<!--#Include virtual="GlobalVariablesNotLoggedIn.asp"-->
<title>Rates - Andresen Events - Online Event Registration</title>
<meta http-equiv="Content-Language" content="en-us">
<title><%= SEOTitle %> </title>
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="Style.css">

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

if (document.form.EventEndMonth.value=="") {
themessage = themessage + " - Event End Month \r";
}

if (document.form.EventEndDay.value=="") {
themessage = themessage + " - Event End Day \r";
}

if (document.form.EventEndYear.value=="") {
themessage = themessage + " - Event End Year \r";
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

edit = request.querystring("Edit")
eventID = request.querystring("EventID")

if len(edit) < 3 then
  Edit = False
end if 

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
   PaymentCountry= rsA("PaymentCountry")
   PaymentOptionsID = rsA("PaymentOptionsID")
end if
				
sql2 = "select * from Event, address, websites, phone where Event.EventID= " & EventID & "  and Event.WebsiteID = Websites.WebsitesID "

acounter = 1
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
	
if Not rs2.eof  Then
	PeopleID = rs2("PeopleID")
	if PeopleID > 0 then
		Session("PeopleID") = PeopleID
	end if
	EventName = rs2("EventName")
	EventTypeID = rs2("EventTypeID")
	AddressID = rs2("AddressID")
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
end if	
		
sql2 = "select * from Event, Business, address, websites, phone where Event.BusinessID = Business.BusinessID and Event.EventID= " & EventID & " and business.addressId = Address.AddressID and Business.BusinessWebsiteID = Websites.WebsitesID and business.phoneid = Phone.PhoneID"

acounter = 1
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
	
if Not rs2.eof  Then
	BusinessID = rs2("BusinessID")
	BusinessName = rs2("BusinessName")
	BusinessWebsiteID = rs2("BusinessWebsiteID")
	BusinessEmail = rs2("BusinessEmail")
	BusinessHours = rs2("BusinessHours")
	BusinessPhoneID = rs2("PhoneID")
	BusinessAddressID = rs2("AddressID")
	BusinessAddress = rs2("AddressStreet")
	BusinessApt= rs2("AddressApt")
	BusinessCity = rs2("AddressCity")
	BusinessState = rs2("AddressState")
	BusinessCountry = rs2("AddressCountry")
	BusinessZip = rs2("AddressZip")
	BusinessWebsite = rs2("Website")
	BusinessWebsiteID = rs2("WebsiteID")
	BusinessPhone = rs2("Phone")
	BusinessCell = rs2("CellPhone")
	BusinessFax = rs2("Fax")
	BusinessTypeID = rs2("BusinessTypeID")
end if	

sql2 = "select * from Event, EventLocation, address, Phone, Websites where EventLocation.WebsiteID = Websites.WebsitesID and Event.EventLocationID = Eventlocation.EventLocationID and EventLocation.AddressID = Address.AddressID  and Eventlocation.PhoneID = Phone.PhoneID and event.eventid = " & eventid 

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

<body border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center" 	background= "DBF5F2">


<!--#Include file="Header.asp"-->






<br />
<table border = "0" cellspacing="0" cellpadding = "0"><tr><td class = "roundedtop" align = "left"><h2>Create an Event - Step1: Choose Your Registration Package</h2></td></tr>
<tr><td class = "roundedBottom">

<table border = "0" cellspacing="0" cellpadding = "0" width = "900" align = "center">
<tr><td class = "body" align = "left">

We offer a variety of types of events, including:
<ul>
<li><a href = "#Free" class = "body">Free Events</a></li>
<li><a href = "#Basic" class = "body">Basic Events</a></li>
<li><a href = "#Dining" class = "body">Dining Events</a></li>
<li><a href = "#Seminar" class = "body">Seminars</a></li>
<li><a href = "#BasicAnimal" class = "body">Basic Animal or Fleece Shows</a></li>
<li><a href = "#SpinOff" class = "body">Alpaca Handcrafter Spin-Off Competitions</a></li>
<li><a href = "#PenSale" class = "body">Alpaca Pen Sale</a></li>
<li><a href = "#Fleece" class = "body">Alpaca Cottage Industry Fleece Shows</a></li>
<li><a href = "#Halter" class = "body">Alpaca Halter and Fleece Shows</a></li>
</ul>
Please look below for more information:
<br />
</td>
</tr>
</table>
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5 width = "889" align = "center" class = "RoundedEdge" >
	<tr>
		<td class ="body" valign = "top" width = "293" ><a name = "Free"></a>
		    <table border = "0" width = "293" cellspacing="0" cellpadding = "0"><tr><td class = "roundedtop" align = "left">             
		    <h2>Free Event</h2></td></tr>
                <tr><td class = "roundedBottom" >
                 <table border = "0" width = "293" cellspacing="0" cellpadding = "0"><tr><td class = "body" align = "left">                     <form  name=form method="post" action="RegCreateTypeCheckAccount.asp">
                 If you have a basic event, you are not charging anything, this is package for you. You can:
                 <ul><li>Receive free registrations.</li>
                 <li>Describe your event.</li>
                 <li>List when and where your event is.</li>
                 </ul>
          Price: <b>Free!</b>
               	          <div align = "center"><big><b>Coming Soon!</b></big></div> <br>  <br>
 </form>
 </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
		</td>
	
	    	<td class ="body" valign = "top" width = "293" ><a name = "Basic"></a>
 <table border = "0" width = "293" cellspacing="0" cellpadding = "0"><tr><td class = "roundedtop" align = "left">             
		    <h2>Basic Event</h2></td></tr>
                <tr><td class = "roundedBottom">
                 <table border = "0" width = "293" cellspacing="0" cellpadding = "0"><tr><td class = "body" align = "left">                     <form  name=form method="post" action="RegCreateTypeCheckAccount.asp">
                  The Basic Event package is ideal if you just need to let people know about the event and receive registration, but nothing fancy (no classes, meals, etc.). Includes:
                 <ul><li>Receive online registrations.</li>
                 <li>Describe your event.</li>
                 <li>List when and where your event is.</li>
                 <li>Information about your organization.</li>
                 <li>Schedule of activities.</li>
                 </ul> <br>
         	          <div align = "center"><big><b>Coming Soon!</b></big></div> <br>  <br>
 </form>
 </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
		</td>

	    	<td class ="body" valign = "top" width = "293" ><a name = "Dining"></a>
		    		 <table border = "0" width = "293" cellspacing="0" cellpadding = "0"><tr><td class = "roundedtop" align = "left">             
		    <h2>Dining Event</h2></td></tr>
                <tr><td class = "roundedBottom">
                 <table border = "0" width = "293" cellspacing="0" cellpadding = "0"><tr><td class = "body" align = "left">                     <form  name=form method="post" action="RegCreateTypeCheckAccount.asp">
                  This is a good package for an event with meals - a banquet, retreat, or perhaps a reunion.<br />
                  Includes:
                 <ul><li>Receive online registrations.</li>
                 <li>Meal registration (includes menus and options).</li>
                 <li>Describe your event.</li>
                 <li>List when and where your event is.</li>
                 <li>Information about your organization.</li>
                 <li>Schedule of activities.</li>
                 </ul> <br>
      	          <div align = "center"><big><b>Coming Soon!</b></big></div> <br>  <br>
 </form>

                </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>


         </td>
                </tr>
                </table>


<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5 width = "889" align = "center" class = "RoundedEdge" ><a name = "Seminar"></a>
	<tr>
		<td class ="body" valign = "top" width = "293" >
		    <table border = "0" width = "293" cellspacing="0" cellpadding = "0"><tr><td class = "roundedtop" align = "left">             
		    <h2>Seminar</h2></td></tr>
                <tr><td class = "roundedBottom">
                 <table border = "0" width = "293" cellspacing="0" cellpadding = "0"><tr><td class = "body" align = "left">                     <form  name=form method="post" action="RegCreateTypeCheckAccount.asp">
                  This is a good package for any seminar, class, workshop type of event, such as farm classes, corporate retreat, or even reunions.<br />
                   Includes:
                 <ul><li>Receive online registrations.</li>
                 <li>Class registration (including instructor's information).</li>
                 <li>Meal registration.</li>
                 <li>Describe your event.</li>
                 <li>List when and where your event is.</li>
                 <li>Information about your organization.</li>
                 <li>Schedule of activities.</li>
                 </ul> <br>
           	          <div align = "center"><big><b>Coming Soon!</b></big></div> <br>  <br>
 </form>
 </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
		</td>
	<td class ="body" valign = "top" width = "293" >
		    	<table border = "0" width = "293" cellspacing="0" cellpadding = "0"><tr><td class = "roundedtop" align = "left">             <a name = "SpinOff"></a>
 <h2>Alpaca Handcrafter Spin-Off Competition</h2></td></tr>
                <tr><td class = "roundedBottom" >
                 <table border = "0" width = "293" cellspacing="0" cellpadding = "0"><tr><td class = "body" align = "left">                     <form  name=form method="post" action="RegCreateTypeCheckAccount.asp">
                 Great for any show that one or more types of animals, and you just need to register the humans. <br />Includes:
                 <ul><li>Receive online registrations.</li>
                  <li>Spin-off registration.</li>
                  <li>Judges.</li>
                 <li>Describe your event.</li>
                 <li>List when and where your event is.</li>
                 <li>Information about your organization.</li>
                 </ul> <br>
    	          <div align = "center"><big><b>Coming Soon!</b></big></div> <br> <br> 
 </form>
 </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                
</td>
	    	<td class ="body" valign = "top" width = "293" >
        <table border = "0" width = "293" cellspacing="0" cellpadding = "0"><tr><td class = "roundedtop" align = "left">             <a name = "BasicAnimal"></a>
		    <h2>Basic Animal or Fleece Show <small>(Alpacas, Sheep, Rabbit, Goats, Yaks, Buffalo, etc.)</small></h2></td></tr>
                <tr><td class = "roundedBottom">
                 <table border = "0" width = "293" cellspacing="0" cellpadding = "0"><tr><td class = "body" align = "left">                     <form  name=form method="post" action="RegCreate.asp">
                 Great for any show that one or more types of animals, and you just need to register the humans. <br />Includes:
                 <ul><li>Receive online registrations.</li>
                 <li>Vendor registrations.</li>
                 <li>Sponsor registrations.</li>
                  <li>Class registration (including instructor's information).</li>
                 <li>Meal registration.</li>
                  <li>Silent auction.</li>
                  <li>Advertising registration.</li>
                 <li>Describe your event.</li>
                 <li>List when and where your event is.</li>
                 <li>Information about your organization.</li>
                 <li>Schedule of activities.</li>
                 </ul> <br>
     Standard Price: $159.95<Br />
			Introductory Rate:<b>Only $127.96 (Ends 9/15/12)!</b>
               <br>
	           <div align = "center"><input name="EventID"  type = "hidden" value = "<%=EventID%>">
	            <input name="PeopleID"  type = "hidden" value = "<%=PeopleID%>">
                <input name="EventTypeID"  type = "hidden" value = "2">
            	<input name="Edit"  type = "hidden" value = "<%=Edit%>">
        		<input type=submit value="Get Started"  class = "regsubmit2" >
							</div>  <br>
 </form>
 </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
		</td>

	    	
</tr>
</table>


<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=5 width = "889" align = "center" class = "RoundedEdge" >
	<tr>
	<td class ="body" valign = "top"  ><a name = "PenSale"></a>
        <table border = "0" width = "316" cellspacing="0" cellpadding = "0"><tr><td class = "roundedtop" align = "left">             
		    <h2>Alpaca Pen Sale</h2></td></tr>
                <tr><td class = "roundedBottom">
                                      <form  name=form method="post" action="RegCreateTypeCheckAccount.asp">
                 Everything you need for any Alpaca Halter (any variation of Halter, Fleece, Spin-Off, Composite, and Cottage Industry Fleece Show). <br />Includes:
               
                         <ul><li>Receive online registrations.</li>
                 <li>Animal registration.</li>

                 <li>Vendor registration.</li>
                 <li>Sponsor registration.</li>
                  <li>Class registration (including instructor's information).</li>
                 <li>Meal registration.</li>
                  <li>Advertising registration.</li>
                  <li>Online animal listings.</li>
                 <li>Describe your event.</li>
                 <li>List when and where your event is.</li>
                 <li>Information about your organization.</li>
                 <li>Schedule of activities.</li>
                 </ul>
                       
                
	          <div align = "center"><big><b>Coming Soon!</b></big></div> <br>
 </form>

                </td>
                </tr>
                </table>
		    
                	
		</td>
		<td class ="body" valign = "top"  ><a name = "Fleece"></a>
		    <table border = "0" width = "303" cellspacing="0" cellpadding = "0"><tr><td class = "roundedtop" align = "left">             
		    <h2>Alpaca Cottage Industry Fleece Show</h2></td></tr>
                <tr><td class = "roundedBottom">
                 <table border = "0" width = "303" cellspacing="0" cellpadding = "0"><tr><td class = "body" align = "left">                     <form  name=form method="post" action="RegCreateTypeCheckAccount.asp">
                  Spin-Off meet fleece show with this special type of composit show.<br />
                   Includes:
               <ul><li>Receive payment online.</li>
                <li>Fleece show registration.</li>
                 <li>Spin-off show registration.</li>
                 <li>Judges.</li>
                 <li>Vendor registration.</li>
                 <li>Sponsor registration.</li>
                  <li>Class registration (including instructor's information).</li>
                 <li>Meal registration.</li>
                  <li>Silent auction.</li>
                  <li>Advertising registration.</li>
                 <li>Describe your event.</li>
                 <li>List when and where your event is.</li>
                 <li>Information about your organization.</li>
                 <li>Schedule of activities.</li>
                 </ul>
      	          <div align = "center"><big><b>Coming Soon!</b></big></div> <br>  <br>
 </form>
 </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
		</td>
	
	    	
		<td class ="body" valign = "top"  ><a name = "Halter"></a>
        <table border = "0" width = "313" cellspacing="0" cellpadding = "0"><tr><td class = "roundedtop" align = "left">             
		    <h2>Alpaca Halter and Fleece Show</h2></td></tr>
                <tr><td class = "roundedBottom">
                                      <form  name=form method="post" action="RegCreateTypeCheckAccount.asp">
                 Everything you need for any Alpaca Halter (any variation of Halter, Fleece, Spin-Off, Composite, and Cottage Industry Fleece Show). <br />Includes:
               
                         <ul><li>Receive online registrations.</li>
                 <li>Halter show registration.</li>
                 <li>Fleece show registration.</li>
                 <li>Spin-off show registration.</li>
                 <li>Vendor registration.</li>
                 <li>Sponsor registration.</li>
                  <li>Class registration (including instructor's information).</li>
                 <li>Meal registration.</li>
                    
                 </ul>
                                   <ul>
                  <li>Silent auction.</li>
                  <li>Stud auction.</li>
                  <li>Advertising registration.</li>
                 <li>Describe your event.</li>
                 <li>List when and where your event is.</li>
                 <li>Information about your organization.</li>
                 <li>Schedule of activities.</li>
                 </ul>
                       
               	          <div align = "center"><big><b>Coming Soon!</b></big></div> <br>  <br>
 </form>

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

<br><br>
	

<!--#Include virtual="Footer.asp"--> 
</body>
</HTML>
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

<% 
sql = "select * from Services, ServicetypeLookup where Services.ServiceTypeLookupID = ServicetypeLookup.ServiceTypeLookupID and ServicetypeLookup.ServiceType = 'SponsorshipLevel' and EventID =  " & EventID & " Order by ServicesID Desc"
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then
	FeePerAnimal = rs("Price")
	FeePerPen  =  rs("Price2")
	MaxQTY2 =  rs("ServiceMaxQuantity")
	if len(MaxQTY2) > 0 then
	  MaxQTY = "checked"
	end if

	MaxDate =  rs("MaxDate")
	if MaxDate = "True" then
	  StopDate = "checked"
	end if
	Description =  rs("Description")


str1 = Description
str2 = "</br>"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1, str2 , vbCrLf)
	
End If  


str1 = Description
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, " ")
End If 

str1 = Description
str2 = "''"
If InStr(str1,str2) > 0 Then
	Description= Replace(str1,  str2, "'")
End If 

	
End If 

%>


<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>



<SCRIPT LANGUAGE="JavaScript">
function verify() {
var themessage = "Please fill out the following fields: \r";
if (document.AddForm.SponsorshipLevelName.value=="") {
themessage = themessage + " - Sponsorship Title \r";
}
if (document.AddForm.SponsorshipLevelPrice.value=="") {
themessage = themessage + " - Sponsorship Price \r";
}


//alert if fields are empty and cancel form submit
if (themessage == "Please fill out the following fields: \r") {
document.AddForm.submit();
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
 sql = "select * from SponsorshipLevels where EventID = " & EventID & ""
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
if not rs.eof then

'publish= rs("publish")
SponsorshipLevelID = rs("SponsorshipLevelID")
SponsorshipLevelPrice= rs("SponsorshipLevelPrice")
SponsorshipLevelDescription= rs("SponsorshipLevelDescription")
SponsorshipLevelQTYAvailable= rs("SponsorshipLevelQTYAvailable")
SponsorshipLevelMaxQtyPer= rs("SponsorshipLevelMaxQtyPer")

str1 = SponsorshipLevelName
str2 = "&nbsp;"
If InStr(str1,str2) > 0 Then
	SponsorshipLevelName= Replace(str1,  str2, " ")
End If 

str1 = SponsorshipLevelName
str2 = "''"
If InStr(str1,str2) > 0 Then
	SponsorshipLevelName= Replace(str1,  str2, "'")
End If 


str1 = SponsorshipLevelDescription
str2 = "''"
If InStr(str1,str2) > 0 Then
	SponsorshipLevelDescription= Replace(str1,  str2, "'")
End If 

end if 
%>

<a name="Top"></a>
 <% PageTitleText = "Add a Sponsorship Option"  %>
<!--#Include file="970Top.asp"-->
<form name = "AddForm" action= "SponsorPagedataPageHandleForm.asp?EventID=<%=EventID%>" method = "post">
<input name="Action"  size = "60" value = "Add" type = "hidden">
<input name="EventID"  size = "60" value = "<%=EventID%>" type = "hidden">

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
    <tr><td class = "body2"  >
    <% Message= request.querystring("Message")
if len(Message)> 2 then %>   
<font color = "red" size="3"><br><%=Message%></font><br>
<% end if %>
To edit sponsorship options please select <a href = "SponsorsEdit.asp?EventID=<%=EventID%>" class = "body">Edit Sponsorship Options</a>

<br>
 * = required field<br></td></tr>
</table>

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "940" align = "center" >
 <tr>
  	<td class = "body2" align = "right" valign = "top">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "500" align = "center" >
 <tr>
  	<td class = "body2" align = "right" >Title: *</td>
  	<td class = "body2" ><input name="SponsorshipLevelName"  size = "45" ></td>
  </tr>
 <tr >
 <tr>
  	<td class = "body2" align = "right">Price (Value):*</td>
  	<td class = "body2"><small>$</small><input class="positive" type="text" name = "SponsorshipLevelPrice" size = 7 maxsize = 9 >
  	
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
</td>
</tr>
 <tr>
  	<td class = "body2" align = "right">QTY Available:</td>
  	<td class = "body2" ><input class="positive" type="text" name = "SponsorshipLevelQTYAvailable" size = 7 maxsize = 9 >
	
	<script type="text/javascript">
	$(".positive").numeric({ negative: false }, function() { alert("No negative values"); this.value = ""; this.focus(); });
	</script>
	</td>
	</tr>
	<tr>
	<td class = "body2" valign = "top" colspan = "2">Sponsorship Option Description:

  <%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>  

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>


<script language="javascript1.2">
// attach the editor to the textarea with the identifier 'textarea1'.
WYSIWYG.attach("SponsorshipLevelID");
</script> 

 
<TEXTAREA NAME="SponsorshipLevelDescription" cols="58" rows="18" wrap="file" id="SponsorshipLevelID" ></textarea>
  
</td>
</tr>
</table>
</td>
<td class = "body" valign = "top">
 <img src = "images/px.gif" width = "1">
</td>
<td class = "body" valign = "top">

<% sql3 = "select * from Services, serviceTypeLookup where services.ServiceTypeLookupID = serviceTypeLookup.ServiceTypeLookupID and  EventID = " & EventID
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql3, conn, 3, 3   
while Not rs.eof 

  if rs("ServiceTypeLookupID") = "9" then
  	StallMatsAvailable = rs("StallMatsAvailable")
  	ElectricityFee = rs("ElectricityFee")
  	VetCheckFee = rs("VetCheckFee")
  	MaxPensPerFarm = rs("MaxPensPerFarm")
  	StallMatPrice = rs("StallMatPrice")
  	StallMatsAvailable= rs("StallMatsAvailable")

  end if

	if rs("ServiceType") = "Halter Show" then
       ShowHalterShow = True 
     End If
 
     if rs("ServiceType") = "Fleece Show" then
       ShowFleeceShow = True 
     End If

     if rs("ServiceType") = "Vendors" then
       ShowVendors = True 
     End If


     	if rs("ServiceType") = "Stud Auction" then
       		ShowStudauction = True 
     	End If



     if rs("ServiceType") = "Sponsor" then
       ShowSponsors = True
     End If
     
     if rs("ServiceType") = "Advertising" then
       ShowAdvertising = True
     End If


     if rs("ServiceType") = "Classes / Workshops" then
       ShowClasses = True 
     End If

     if rs("ServiceType") = "Dinner" then
       ShowDinner = True 
     End If

     if rs("ServiceType") = "Silent Auction" then
       ShowSilentAuction = True
     End If
rs.movenext
wend
%>

	<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "420" align = "center" >
 		<tr>
 			<td class = "body2" colspan = "2"><h2>Sponsorship Benefits</h2></td>
 		</tr>
  		<tr><td class = "body2"  bgcolor = "#abacab" height = "1" colspan = "2"><img src = "images/px.gif" height = "1" width = "1"></td></tr>

 		<tr>
			<td class = "body2" colspan = "2">
 				This sponsorship includes the following benefits:
 			<input name="ShowHalterShow"  value = "<%=ShowHalterShow%>" type = "hidden">
 			<input name="ShowDinner"  value = "<%=ShowDinner%>" type = "hidden">
 			<input name="ShowVendors"  value = "<%=ShowVendors%>" type = "hidden">
 			<input name="ShowAdvertising"  value = "<%=ShowAdvertising%>" type = "hidden">

 			</td>
		</tr>
		<tr><td class = "body2"  align = "center" width ="400"><b>Benefit</b></td>
  			<td class = "body2"  align = "center"><b>Quantity</b></td>
  		</tr>

		
		
	
		<% if  ShowHalterShow = True  then  
		
		
sql = "select * from Services, ServiceTypeLookup where Services.ServiceTypeLookupID = ServiceTypeLookup.ServiceTypeLookupID and ServiceType = 'Halter Show' and EventID =  " & EventID & " Order by ServicesID Desc"
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	

	ServicesID = rs("ServicesID")
	ServiceStartDateMonth  = rs("ServiceStartDateMonth")
	ServiceStartDateDay  = rs("ServiceStartDateDay")
	ServiceStartDateYear  = rs("ServiceStartDateYear")
	
	ServiceEndDateMonth  = rs("ServiceEndDateMonth")
	ServiceEndDateDay  = rs("ServiceEndDateDay")
	ServiceEndDateYear  = rs("ServiceEndDateYear")

	
	Price1Discount= rs("Price1Discount")
	Price1DiscountStartDateMonth  = rs("Price1DiscountStartDateMonth")
	Price1DiscountStartDateDay  = rs("Price1DiscountStartDateDay")
	Price1DiscountStartDateYear  = rs("Price1DiscountStartDateYear")
	Price1DiscountEndDateMonth  = rs("Price1DiscountEndDateMonth")
	Price1DiscountEndDateDay  = rs("Price1DiscountEndDateDay")
	Price1DiscountEndDateYear  = rs("Price1DiscountEndDateYear")

	
	Price2Discount= rs("Price2Discount")
	Price2DiscountStartDateMonth  = rs("Price2DiscountStartDateMonth")
	Price2DiscountStartDateDay  = rs("Price2DiscountStartDateDay")
	Price2DiscountStartDateYear  = rs("Price2DiscountStartDateYear")
	Price2DiscountEndDateMonth  = rs("Price2DiscountEndDateMonth")
	Price2DiscountEndDateDay  = rs("Price2DiscountEndDateDay")
	Price2DiscountEndDateYear  = rs("Price2DiscountEndDateYear")

	Price3= rs("Price3")
	Price3Discount= rs("Price3Discount")
	Price3DiscountStartDateMonth  = rs("Price3DiscountStartDateMonth")
	Price3DiscountStartDateDay  = rs("Price3DiscountStartDateDay")
	Price3DiscountStartDateYear  = rs("Price3DiscountStartDateYear")
	Price3DiscountEndDateMonth  = rs("Price3DiscountEndDateMonth")
	Price3DiscountEndDateDay  = rs("Price3DiscountEndDateDay")
	Price3DiscountEndDateYear  = rs("Price3DiscountEndDateYear")

	Price4= rs("Price4")	
	Price4Discount= rs("Price4Discount")
	Price4DiscountStartDateMonth  = rs("Price4DiscountStartDateMonth")
	Price4DiscountStartDateDay  = rs("Price4DiscountStartDateDay")
	Price4DiscountStartDateYear  = rs("Price4DiscountStartDateYear")
	Price4DiscountEndDateMonth  = rs("Price4DiscountEndDateMonth")
	Price4DiscountEndDateDay  = rs("Price4DiscountEndDateDay")
	Price4DiscountEndDateYear  = rs("Price4DiscountEndDateYear")

	
	EventTypeID = rs("EventTypeID")
	FeePerAnimal = rs("Price")
	FeePerPen  =  rs("Price2")
	
	MaxQTY =  rs("ServiceMaxQuantity")
	MaxQTY2 =  rs("ServiceMaxQuantity2")
	MaxQTY3 =  rs("ServiceMaxQuantity3")
	if len(MaxQTY2) > 0 then
	  MaxQTYCheckbox = "checked"
	end if

	StopDate1 =  rs("ServiceEndDate")
	if len(StopDate1) > 0 then
	  StopDate = "checked"
	end if
	VetCheckFee = rs("VetCheckFee")
	ElectricityFee = rs("ElectricityFee")
	ElectricityAvailable  = rs("ElectricityAvailable")
	
	Electricityoptional  = rs("Electricityoptional")

	MaxPensPerFarm = rs("MaxPensPerFarm")
	
	if MaxPensPerFarm > 0 then
	else
		MaxPensPerFarm = 40
	end if 

	MaxDisplaysPerFarm= rs("MaxDisplaysPerFarm")
	
	if MaxDisplaysPerFarm > 0 then
	else
		MaxDisplaysPerFarm = 40
	end if 
	StallMatsAvailable  = rs("StallMatsAvailable")
 	StallMatPrice  = rs("StallMatPrice")

	StallMatPrice = rs("StallMatPrice")
end if
		
		
		
		 if  FeePerPen > 0 then
		%>

		<tr>
 			<td class = "body2" colspan = "2"><br><b>Halter Show Benefits</b></td>
 		</tr>
 		<tr><td class = "body2"  bgcolor = "#abacab" height = "1" colspan = "2"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
 		<tr><td class = "body2"  height = "1" colspan = "2">To edit Halter Show options please select <a href = "HalterHome.asp?EventID=<%=eventID%>" class = "body"> Halter Overview</a> </td></tr>

  		<tr><td class = "body2"  height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
  		<tr><td class = "body2"   align = "Right">Free Halter Stall(s):</td>
  			<td class = "body2"   align = "right">
  			<select size="1" name="FreeHalterStall">
  			  		<option value="0">0</option>
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
				</select>
		</td>
  		</tr>
<% end if %>

<% if  Price3 > 0 then %>
  		<tr><td class = "body2"   align = "Right">Free Display Stall(s):</td>
  			<td class = "body2"  align = "right">
  			<select size="1" name="FreeDisplayStall">
  			  		<option value="0">0</option>
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
				</select>
		</td>
  		</tr>
<% end if %>
  		
  		<% if VetCheckFee > 0 then %>
  		<tr><td class = "body2"   align = "Right">Expedited Vet Check In:</td>
  			<td class = "body2"   align = "right">
  			<select size="1" name="ExpeditedVetCheck">
  			  		<option value="0">No</option>
					<option value="1">Yes</option>
				</select>
		</td>
  		</tr>
  		<% if VetCheckFee > 0 then %>
  		<tr><td class = "body2"  align = "Right">Free Vet Check In:</td>
  			<td class = "body2"   align = "right" >
  			<select size="1" name="FreeVetCheck">
  					<option value="0">No</option>
					<option value="1">Yes</option>
				</select>
		</td>
  		</tr>
  		<% end if %>
  		 <% if StallMatsAvailable = "True" Then %>
  		<tr><td class = "body2"  align = "Right">Free Stall Mats:</td>
  			<td class = "body2"   align = "right" >
  			<select size="1" name="FreeStallMat">
    				<option value="0">0</option>
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
				</select>
		</td>
  		</tr>
  		<% end if %>
  		<% if ElectricityFee > 0 then %>
  		<tr><td class = "body2"  align = "Right">Free Electricity:</td>
  			<td class = "body2"   align = "right" >
  			<select size="1" name="FreeElectricity">
    				<option value="0">No</option>
					<option value="1">Yes</option>
				</select>
		</td>
  		</tr>
   <% end if %>
  		
  		
		<% end if %>
	<% end if %>
	

	 <% if ShowAdvertising = True then %>
	<tr><td class = "body2" colspan = "2"><br><b>Advertising Options</b></td></tr>
 	<tr><td class = "body2" colspan = "2" bgcolor = "#abacab" height = "1" ><img src = "images/px.gif" height = "1" width = "1"></td></tr>
 	<tr><td class = "body2" colspan = "2" height = "1" >To edit Advertising options please select <a href = "Advertisingspagedata.asp?EventID=<%=eventID%>" class = "body"> Add Advertising Options</a> </td></tr>
 	<tr><td class = "body2" >
 		
		<% sql = "select * from AdvertisingLevels  where EventID = " & EventID  
		    Set rs = Server.CreateObject("ADODB.Recordset")
    		rs.Open sql, conn, 3, 3 
    		while not  rs.eof  %>
			  <tr><td class = "body2"  align = "Right"><%=rs("AdvertisinglevelName")%></td>
  			<td class = "body2"   align = "right" >
  			<select size="1" name="AdvertisingOptionQTY<%=rs("AdvertisingLevelID")%>">
    				<option value="0">0</option>
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
				</select>
		</td>
  		</tr>

			<% rs.movenext
			wend %>
	</td></tr>
   <% end if %>



	<% if Showvendors = True then %>
	<tr><td class = "body2" colspan = "2"><br><b>Vendor Options</b></td></tr>
 	<tr><td class = "body2" colspan = "2" bgcolor = "#abacab" height = "1" ><img src = "images/px.gif" height = "1" width = "1"></td></tr>
 	<tr><td class = "body2" colspan = "2" height = "1" >To edit vendor options please select <a href = "Vendorspagedata.asp?EventID=<%=eventID%>" class = "body"> Add Vendor Options</a> </td></tr>
 	<tr><td class = "body2" >
 		
		<% sql = "select * from VendorLevels  where EventID = " & EventID  
		    Set rs = Server.CreateObject("ADODB.Recordset")
    		rs.Open sql, conn, 3, 3 
    		while not  rs.eof  %>
			  <tr><td class = "body2"  align = "Right"><%=rs("VendorStallName")%></td>
  			<td class = "body2"   align = "right" >
  			<select size="1" name="VendorOptionQTY<%=rs("VendorLevelID")%>">
    				<option value="0">0</option>
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
				</select>
		</td>
  		</tr>

			<% rs.movenext
			wend %>
	</td></tr>
   <% end if %>
	
<% if ShowDinner = True then %>
	<tr>
 			<td class = "body2" colspan = "2"><br><b>Dinner Benefits</b></td>
 		</tr>
 		<tr><td class = "body2"  bgcolor = "#abacab" height = "1" colspan = "2"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
 		<tr><td class = "body2"  height = "1" colspan = "2">To edit dinner options please select <a href = "DinnerHome.asp?EventID=<%=eventID%>" class = "body"> Dinner Overview</a> </td></tr>
		<tr><td class = "body2"  align = "Right">Free Dinner Tickets:</td>
  			<td class = "body2"   align = "right" >
  			<select size="1" name="FreeDinnerTickets">
    				<option value="0">0</option>
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
				</select>
		</td>
  		</tr>


<% end if %>

<tr>
 			<td class = "body2" colspan = "2"><br><b>Extra Options</b></td>
 		</tr>
 		<tr><td class = "body2"  bgcolor = "#abacab" height = "1" colspan = "2"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
 		<tr><td class = "body2"  height = "1" colspan = "2">To add extra options please select <a href = "ExtraOptionsAdd.asp?EventID=<%=eventID%>" class = "body"> Add Extra Options</a> </td></tr>
 		
 		
 		
  		<tr><td class = "body2"  height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
  		
  		<% sql = "select * from ExtraOptions where not(OptionType = 'Halter') and not(OptionType = 'Dinner') and not(OptionType = 'Advertising') and not (OptionType = 'Vendor') and EventID = " & EventID
			Set rs = Server.CreateObject("ADODB.Recordset")
			rs.Open sql, conn, 3, 3   
			while Not rs.eof %>
			
			<tr><td class = "body2"   align = "Right"><%=rs("ExtraOptionsName")%>:</td>
  			<td class = "body2"   align = "right">
  			<select size="1" name="ExtraOptionQTY<%=rs("ExtraOptionsID")%>">
  			  		<option value="0">0</option>
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
				</select>
		</td>
  		</tr>
		<% rs.movenext
		wend %> 

	</table>

</td>
</tr>



<tr>
  <td class = "body2" colspan = "3" align = "center">
  <input type=submit value="Add a Sponsorship Option"  class = "regsubmit2" >
</td>
</tr>
 </table>
</form>

<br> 
<!--#Include file="970Bottom.asp"--><br>

<!--#Include virtual="Footer.asp"--> 
</Body>
</HTML>

<SCRIPT LANGUAGE="JavaScript" TYPE="text/javascript">
<!--
if(window.event + "" == "undefined") event = null;
function HM_f_PopUp(){return false};
function HM_f_PopDown(){return false};
popUp = HM_f_PopUp;
popDown = HM_f_PopDown;

//-->
</SCRIPT>
<%

  if len(EventID) > 0 then
	sql = "select  * from Event where EventID= " & EventID
	'response.write(sql)
	rs.Open sql, conn, 3, 3
	If not rs.eof then
	    EventTypeID = rs("EventTypeID")
		EventName = rs("EventName")
		EventDescription = rs("EventDescription")
		EventStartMonth = rs("EventStartMonth")
		EventStartDay = rs("EventStartDay")
		EventStartYear = rs("EventStartYear")
		EventEndMonth = rs("EventEndMonth")
		EventEndDay = rs("EventEndDay")
		EventEndYear = rs("EventEndYear")
		EventLocationID = rs("EventLocationID")
  		EventStartDate = rs("EventStartMonth") & "/" & rs("EventStartDay") & "/" & rs("EventStartYear")
		EventEndDate = rs("EventEndMonth") & "/" & rs("EventEndDay") & "/" & rs("EventEndYear")
		AOBA = rs("AOBA")
		AOBAFee = rs("AOBAFee")
	end if
				 
	If Len(EventDescription) > 1 Then

	Else
		EventDescription  = " "
	End If 		
		
sql = "select * from EventSiteDesignTemp where EventID= " & EventID
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3  
    if not rs.eof then 
    EventImage= rs("EventImage")
		Header = rs("Header")
		HeaderText = rs("HeaderText")
		ShowEventName = rs("ShowEventName")
		logo = rs("Logo")
		PagebackgroundImage = rs("PagebackgroundImage")

		FooterImage = rs("FooterImage")
		ScreenBackgroundImage = rs("ScreenBackgroundImage")
		Pagewidth = rs("Pagewidth")
		PageAlign = rs("PageAlign")
		LayoutStyle = rs("LayoutStyle")
		ScreenBackgroundColor = rs("ScreenBackgroundColor")
		PageBorder = rs("PageBorder")
		PageBackgroundColor = rs("PageBackgroundColor")
		PageBorderColor = rs("PageBorderColor")
		
		if len(PageBackgroundColor) > 1 then
			PageHightlightColor = PageBackgroundColor
		else
			PageHightlightColor ="#81D8D0"
		end if 
		
		MenuBackgroundImage = rs("MenuBackgroundImage")	
		MenuBackgroundColor = rs("MenuBackgroundColor")
		MenuFontMouseoverColor = rs("MenuFontMouseoverColor")
		MenuColor = rs("MenuColor")
		MenuFont = rs("MenuFont")
		MenuSize= 10
		MenuFontMouseOverColor= rs("MenuFontMouseOverColor")
		MenuHyperlinkColor= rs("MenuHyperlinkColor")
		
		PageTextFont = rs("PageTextFont")
		PageTextColor = rs("PageTextColor")
		PageTextFontSize = rs("PageTextFontSize")
		PageTextHyperLinkColor = rs("PageTextHyperLinkColor")
		PageTextMouseOverColor = rs("PageTextMouseOverColor")
		TitleFont = rs("TitleFont")
		TitleColor = rs("TitleColor")
		TitleSize = rs("TitleSize")
		TitleAlign = rs("TitleAlign")
		H2Font = rs("H2Font")
		H2Color = rs("H2Color")
		H2Size = rs("H2Size")
		H2Align = rs("H2Align")
		
		H3Font = rs("H3Font")
		H3Color = rs("H3Color")
		H3Size = rs("H3Size")
		H3Align = rs("H3Align")


	End If
rs.close

sql = "select  * from EventLocation, Address where EventLocation.AddressID = Address.AddressID and EventLocation.EventLocationID= " & EventLocationID
	rs.Open sql, conn, 3, 3
	If not rs.eof then
		EventLocationName = rs("EventLocationName")
		EventLocationStreet = rs("AddressStreet")
		EventLocationApt = rs("AddressApt")
		EventLocationCity = rs("AddressCity")
		EventLocationState = rs("AddressState")
		EventLocationZip = rs("AddressZip")
		EventLocationCountry = rs("AddressCountry")
	 	end if
   rs.close
end if
%>

<style>
		H1 {font: <%=TitleSize %>pt <%=TitleFont %>; color: <%=TitleColor %>; font-weight: 600; align: left}
		H2 {font: 18pt <%=H2Font %>; color: <%=H2Color %> ;  align: left}
		H3 {font: 16pt <%=H3Font %>; color: <%=H3Color %> ; font-weight: 500; align: left}
	.Body {font: <%=PageTextFontSize%>pt <%=PageTextFont%>; color: <%=PageTextColor %>}
		A.Body {font: <%=PageTextFontSize%>pt <%=PageTextFont%>; color: <%=PageTextHyperLinkColor %>}
	A.Body:hover { color: <%=PageTextMouseOverColor%>}
		
		.smallBody {font: <%=PageTextFontSize - 2%>pt <%=PageTextFont%>; color: <%=PageTextColor %>}
		A.smallBody {font: <%=PageTextFontSize - 2%>pt <%=PageTextFont%>; color: <%=PageTextHyperLinkColor %>}
		A.smallBody:hover { color: <%=PageTextMouseOverColor%>}

		
		.EventMenu {font: 10pt Black;}
		A.EventMenu {font: <%=MenuSize%>pt <%=MenuFont%>; color: <%=MenuHyperLinkColor %>}
		A.EventMenu:hover { color: <%=MenuFontMouseOverColor%>}

			.Heading {font: 10pt arial; color: <%=MenuColor %>}
		A.Heading {font: 10pt arial; color: <%=MenuFontMouseOverColor %>}
</style>
 <%	
LayoutStyle = "Classic Landscape" 	
if EventID = 14 then	
LayoutStyle = "Classic Landscape" 		
    Tablewidth = "980"
    end if
If LayoutStyle = "Modern Landscape" or LayoutStyle = "Classic Landscape" Then
Pagewidth = "980"
Textwidth  = "890"
bodywidth = "960"
TableWidth = "970"
OuterTableWidth = "970"
InnerTableWidth = "960"
TableTop = "images/header970.jpg"
TableBackground = "images/background970.jpg"
TableFooter= "images/Footer970.jpg"
Else
Pagewidth = "980"
Textwidth  = "780"
bodywidth = "820"
OuterTableWidth = "700"
InnerTableWidth = "690"
TableTop = "images/Registrationheader.jpg"
TableBackground = "images/Registrationbackground.jpg"
TableFooter= "images/RegistrationFooter.jpg"
 end if
StripeColor = "#F4F4F4" 




 If LayoutStyle = "Modern Landscape" Then %>

   <% Current = "Overview" %>
   <!--#Include virtual="EventHeaderTabsInclude.asp"--> 
      
<table cellpadding = "0" cellspacing = "0" border = "0" width = "100%" height = "34" background = "images/SelectedHeader.jpg">
   <tr>
      <td bgcolor="#00B4C4" width = "1"><img src = "images/px.gif" width = "1" height = "1"></td>
   <td ><img src = "images/px.gif" width = "20" height = "1" >
	 <a href = "RegManageHome.asp?EventID=<%=EventID%>" class = "menu2">Event Overview</a> | 
	 <a href = "EditEvent.asp?EventID=<%=EventID%>" class = "menu2">Event Facts</a> | 
	 </td>
	 <td align = "right">
	 	<a href = "RegHome.asp?PeopleID=<%=PeopleID%>" class = "menu2">List of Your Events</a> |
 		<a href = "EditEvent.asp?EventID=<%=EventID%>" class = "menu2">Your Information</a> |
	 	<a href = "PhotoContestHome.asp?EventID=<%=PeopleID%>" class = "menu2">Photo Contest</a>&nbsp;
	 </td>
	    <td bgcolor="#00B4C4" width = "1"><img src = "images/px.gif" width = "1" height = "1"></td>
	</tr>
</table>

   <!--#Include virtual="EventHeaderTabsIncludeBottom.asp"--> 

<table border = "0"   cellpadding=0 cellspacing=0 width = "<%=Pagewidth%>"  align = "center" bgcolor = "<%=PageBackgroundColor %>">
<tr>
<td >
	<table border = "0"   cellpadding=0 cellspacing=0 width = "<%=Pagewidth%>" align = "center" bgcolor = "<%=PageBackgroundColor %>">
	<tr><td  valign = "top" bgcolor = "<%=PageBackgroundColor %>">

   <% end if 

 If LayoutStyle = "Modern Portrait" or LayoutStyle = "Portrait"  or LayoutStyle = "Portrait2" Then %>
			<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "<%=Pagewidth%>"  align = "center" bgcolor = "<%=PageBackgroundColor %>"  >
				<tr>
				<td valign = "top"><table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "<%=Pagewidth%>"  height = "100%" align = "center" >
						<tr>
							<td border = 0 valign = "top" bgcolor = "<%=MenuBackgroundColor%>" background="<%=MenuBackgroundImage%>" width = "160">
							

							<% If Len(Logo) > 1 Then %>
							<table border = 0 valign = "top"  >
								<tr><td align = "right" colspan = "2">
									<img src = "<%=Logo %>" width = "160" alt = "<%=EventName%> Registration"><br>
								</td></tr>
								<tr><td width = "5"><img src = "images/PX.gif" alt= "<%=Eventname%> Registration"></td>
								<td class = "EventMenu" align = "left">
								<img src = "images/px.gif" height = "1" width = "5"><br>
														
<% sql2 = "select * from EventPagelayout where PageAvailable = True and ShowPage = True and EventID = " & EventID & " order by LinkOrder"	
acounter = 1
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
While Not rs2.eof %>
	 		
&nbsp;&nbsp;&nbsp;<a href = "<%=rs2("FileName")%>" class = "EventMenu"><%=rs2("PageName")%></a><br>
<img src = "images/px.gif" height = "1" width = "5"><br>
								
<% rs2.movenext
 	Wend %>
</td>
</tr>
</table>  							
 							
						    <% Else %>
						    <table><tr><td width = "5" valign = "top" align = "center" class = "EventMenu">
 								<br>
							<%  namelen = len(EventName)
							  i = 0
							  while i < (namelen + 1)
							  i = i + 1
							%>
							<center><big><b><%=mid(EventName, i, 1) %></b></big><br></center>
							
							<% wend %>
							
									
							
							<br>
							</td>
							<td class = "EventMenu" align = "left" valign = "top">
							<br><br>
									&nbsp;&nbsp;&nbsp;<a href = "EventRegister.asp?EventID=<%=EventID%>" class = "EventMenu"><b>Register Now!</b></a><br>
									&nbsp;&nbsp;&nbsp;<a href = "EventHome.asp?EventID=<%=EventID%>" class = "EventMenu"><b>Event Home</b></a><br><br />
 								
								<img src = "images/px.gif" height = "1" width = "5"><br>
						
							
							<% sql2 = "select * from EventPagelayout where PageAvailable = True and ShowPage = True and EventID = " & EventID & " order by LinkOrder"	
								acounter = 1
								Set rs2 = Server.CreateObject("ADODB.Recordset")
								rs2.Open sql2, conn, 3, 3 
	
								While Not rs2.eof %>
	 		
 					
 									
 								&nbsp;&nbsp;&nbsp;<a href = "<%=rs2("FileName")%>" class = "EventMenu"><%=rs2("PageName")%></a><br>
								<img src = "images/px.gif" height = "1" width = "5"><br>
								
	 
 							<% rs2.movenext
 							Wend %>
							</td>
 							</tr>
 							</table>
	
								<% End If %>
							
								</td>	
							<td class = "body" valign = "top" bgcolor = "<%=PageBackgroundColor %>" width = "<%=Bodywidth%>">
								<%
								HeaderName = False
								If Len(Header) > 1 Then 
										HeaderName = True%>
									<img src = "<%=Header %>" width = "<%=Bodywidth%>">
							<% End If %>

	
			<% End If %>

<%

  If LayoutStyle = "Classic Portrait"  Then %><table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "<%=Pagewidth%>"  align = "center" bgcolor = "white" >
				<tr>
				<td  ><table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "<%=Pagewidth%>"   align = "center"  >
					<tr><td align = "center" colspan = "2" >
							<%
								If Len(Header) > 1 Then 
										HeaderName = True%><img src = "<%=Header %>" width = "<%=Pagewidth%>" border = "0"><% End If %>
	                        </td></tr>
	                        									
							<tr><td align = "center" colspan = "2" >
							<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "<%=Pagewidth%>"   align = "center" >
							<tr>
							<td class = "body" height = "10"><img src = "Images/px.gif" width = "10" height = "1" border = "0" alt = "<%=EventName %> Online Event registration" />
							</td>							
							<td class = "body" height = "150" >
									<font size="4"><%=EventName %></font><br />
									<font size="2"><b><img src = "Images/px.gif" width = "4" height = "1" border = "0" alt = "<%=EventName %> Online Event registration" /><%=EventStartdate %> to <%=EventEnddate %><br />
									<img src = "Images/px.gif" width = "4" height = "1" border = "0" alt = "<%=EventName %> Online Event registration" /><%= EventLocationName %><br />

							</td>
							<td align = "right">	<% If Len(Logo) > 1  and len(Header) < 5 Then 
								       HeaderName = True%>
											<img src = "<%=Logo %>" height = "150" align = "center" border = "0"><br>
								<% End If %>
							</td>
							</tr></table>
	                        </td></tr>
	                        
<tr bgcolor = "<%=MenuBackgroundColor%>" ><td colspan = "2" height = "45" align = "left"><img src = "images/px.gif" width = "10" height = "1" alt = "<%=EventName %> Online Event Registration" /><face size = "3"><a href = "EventRegister.asp?EventID=<%=EventID%>" class = "EventMenu"><b>Register Now!</b></a></face>

</td>
</tr>                        
<tr><td bgcolor = "<%=PageBackgroundColor%>" background = "<%=PageBackgroundImage%>"  valign = "top" class = "body" colspan= "2">
								
		
	
			<% End If %>


<%  If LayoutStyle = "Classic Landscape"  Then  %>
			<table border = "0" height = "300" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "<%=Pagewidth%>"  align = "center" bgcolor = "<%=PageBackgroundColor %>" >
				<tr>
				<td align = "center" ><table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "<%=Pagewidth%>" height = "100"  align = "center" >
				<% If Len(Header) > 1 Then 
										HeaderName = True%><img src = "<%=Header %>" width = "<%=Pagewidth%>" border = "0"><% End If %>
<% if len(Logo) > 1 then %>
<tr><td align = "center" colspan = "2" >
    <table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "<%=Pagewidth%>"  align = "center" >
    <tr>
        <td width = "500" valign = "top">
        
        
        
        <% If Len(Logo) > 1 And len(Header) < 5 Then 
		           HeaderName = True%>
				<img src = "<%=Logo %>" height = "70" align = "center" border = "0"><br>
			 <% else 
			 if ShowEventName = True then %>
				<br><h1><%=EventName %></h1><br>
			<% End if
			End If %>
        </td>
         <td align = "center" class = "body">
            <%=HeaderText %>
        </td>
    </tr>
    </table>
								
	</td></tr>
	<% end if %>
	<% If not EventTypeID = 5 then %>
	<tr><td bgcolor = "<%=MenuBackgroundColor%>" background = "<%=MenuBackgroundImage%>"  valign = "middle" class = "body" align = "center" height = "77">
	
<% sql2 = "select * from EventPagelayout where PageAvailable = True and ShowPage = True and EventID = " & EventID & " order by LinkOrder"	
acounter = 1
Set rs2 = Server.CreateObject("ADODB.Recordset")
rs2.Open sql2, conn, 3, 3 
if not rs2.eof then 
	                           Totallinkcount = rs2.recordcount 
	                           linksperrow = round(Totallinkcount/7)  %>
	                       <table border = "0" width = "<%=Pagewidth%>">
	                       <tr>
	 		    <td class = "EventMenu" width = "<%=Pagewidth/6%>" valign = "top">
	 		    <% if ShowRegistration = True then %>
	 		    <a href = "EventRegister.asp?EventID=<%=EventID%>" class = "EventMenu"><b>Register Now!</b></a>
	 		    <% end if %><br /><a href = "EventHome.asp?EventID=<%=EventID%>" class = "EventMenu"><b>Event Home</b></a>

	 		    </td>    
							<%	
							currentlink = 1
							While Not rs2.eof 
							  if currentlink   = 1 then %>
	 		                <td class = "EventMenu" width = "<%=Pagewidth/6%>" valign = "top" height = "33">
	 		                <% end if %>
	 		    <a href = "<%=rs2("FileName")%>" class = "EventMenu"><%=rs2("PageName")%></a><br />
	 		    <% if currentlink   = (linksperrow + 1) then 
							     currentlink = 1 %>
	 		                </td>
	 		                <% else
	 		                    currentlink =currentlink + 1
	 		                
	 		                end if
	 		                %>

	 
 							<% rs2.movenext
 							Wend %>
 								</tr></table>
 							<% end if %></td>
 							</tr>
 							<% end if %>
 							<tr>
							<td class = "body" valign = "top" bgcolor = "<%=PageBackgroundColor %>" height = "600">
					
	
			<% End If %>



<style type="text/css"> 
.roundedtop
{
border-top:1px solid #a1a1a1;
border-left:1px solid #a1a1a1;
border-right:1px solid #a1a1a1;
padding:5px 10px; 
box-shadow: 5px 5px 10px #ababab;
background-color: <%=menuBackgroundColor%> ;
margin:0px;

border-top-left-radius:5px;
border-top-right-radius:5px;
-moz-border-radius-topleft:5px; /* Firefox 3.6 and earlier */
-moz-border-radius-topright:5px; /* Firefox 3.6 and earlier */
}
</style>
<style type="text/css"> 
.roundedBottom
{
border-bottom:1px solid #a1a1a1;
border-left:1px solid #a1a1a1;
border-right:1px solid #a1a1a1;
margin-top:0px;
 margin-bottom:10px;
 margin-right:0px;
 margin-left:0px;
padding:5px 10px; 
background:white;

box-shadow: 5px 5px 10px #ababab;
border-bottom-left-radius:5px;
border-bottom-right-radius:5px;
-moz-border-radius-bottomleft:5px; /* Firefox 3.6 and earlier */
-moz-border-radius-bottomright:5px; /* Firefox 3.6 and earlier */
}

</style>

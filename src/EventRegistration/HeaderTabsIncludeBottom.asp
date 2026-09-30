 <table border = "0" cellpadding = "0" cellspacing = "0" width = "<%=screenwidth - 10%>">
<tr>
 <%    if ShowHalterShow = True then   %>
<% if Current = "Halter" and not pagename="Vet Check" then %>
<td class = "tabBottomOn"  width = "90" height = "30" align = "center" ><b><a href = "HalterHome.asp?EventID=<%=eventID%>" class = "menu2"><center>Halter Show</center></a></b></td>
<% else %> 
<td  class = "tabBottomOff"  width = "90" height = "30" align = "center" ><b><a href = "HalterHome.asp?EventID=<%=eventID%>" class = "menu"><center>Halter Show</center></a></b></td>
<% end if %>
<% end if %>
 <% if ShowHalterShow = True then %>
  <% if pagename="Vet Check" then %>
<td class = "tabBottomOn"  width = "90" height = "30" align = "center" ><b><a href = "PageData2.asp?pagename=Vet Check&EventID=<%=eventID%>&Header=Halter" class = "menu2"><center>Vet Check</center></a></b></td>
<% else %> 
<td  class = "tabBottomOff" width = "90" height = "30" align = "center" ><b><a href = "PageData2.asp?pagename=Vet Check&EventID=<%=eventID%>&Header=Halter" class = "menu"><center>Vet Check</center></a></b></td>
<% end if %>
<% end if %>
<% if ShowFleeceShow = True then %>
<% if Current = "Fleece" then %>
<td class = "tabBottomOn"  width = "90" height = "30" align = "center" ><b><a href = "FleeceHome.asp?EventID=<%=eventID%>" class = "menu2"><center>Fleece Show</center></a></b></td>
<% else %> 
<td  class = "tabBottomOff" width = "90" height = "30" align = "center" ><b><a href = "FleeceHome.asp?EventID=<%=eventID%>" class = "menu"><center>Fleece Show</center></a></b></td>
<% end if %>
<% end if %>
<% if ShowAdvertising = True then %>
<% if Current = "Advertising" then %>
<td class = "tabBottomOn"   width = "90" height = "30" align = "center" ><b><a href = "AdvertisingHome.asp?EventID=<%=eventID%>" class = "menu2"><center>Advertising</center></a></b></td>
<% else %>
<td  class = "tabBottomOff" width = "90" height = "30" align = "center" ><b><a href = "AdvertisingHome.asp?EventID=<%=eventID%>" class = "menu"><center>Advertising</center></a></b></td>
	   <% end if %>
	     <% end if %>
	   
      
   <% if ShowVendors = True then %>
    <% if Current = "Vendors" then %>
	   <td class = "tabBottomOn"  width = "90" height = "30" align = "center" ><b><a href = "VendorsHome.asp?EventID=<%=eventID%>" class = "menu2"><center>Vendors</center></a></b></td>
	<% else %>
		   <td  class = "tabBottomOff" width = "90" height = "30" align = "center" ><b><a href = "VendorsHome.asp?EventID=<%=eventID%>" class = "menu"><center>Vendors</center></a></b></td>
   <% end if %>
    <% end if %>
   
   
   
     <% if ShowSponsors = True then %>
         <% if Current = "Sponsors" then %>
   			<td class = "tabBottomOn"  width = "90" height = "30" align = "center" ><b><a href = "SponsorsHome.asp?EventID=<%=eventID%>" class = "menu2"><center>Sponsorships</center></a></b></td>
   	 <% else %>
   	    	<td  class = "tabBottomOff" width = "90" height = "30" align = "center" ><b><a href = "SponsorsHome.asp?EventID=<%=eventID%>" class = "menu"><center>Sponsorships</center></a></b></td>
   <% end if %>
      <% end if %>
   
     <% if ShowClasses = True then %>
        <% if Current = "Classes" then %>
   	<td class = "body2" width = "90" height = "30" align = "center" ><b><a href = "ClassesHome.asp?EventID=<%=eventID%>" class = "menu2"><center>Classes / Workshops</center></a></b></td>
   	     <% else %>
   	    <td  class = "tabBottomOff"  width = "90" height = "30" align = "center" ><b><a href = "ClassesHome.asp?EventID=<%=eventID%>" class = "menu"><center>Classes / Workshops</center></a></b></td>
 	 <% end if %>
   <% end if %>
   
   
       <% if  ShowDinner = True then %>
               <% if Current = "Dinner" then %>
    		<td class = "tabBottomOn"  width = "90" height = "30" align = "center" ><b><a href = "DinnerHome.asp?EventID=<%=eventID%>" class = "menu2"><center>Dinner</center></a></b></td>
    		<% else %>
    		 <td  class = "tabBottomOff"  width = "90" height = "30" align = "center" ><b><a href = "DinnerHome.asp?EventID=<%=eventID%>" class = "menu"><center>Dinner</center></a></b></td>
    <% end if %>
        <% end if %>
        
    
     <% if  ShowSilentAuction = True then %>
         <% if Current = "Silent Auction" then %>
				<td class = "tabBottomOn"  width = "90" height = "30" align = "center" ><b><a href = "PageData2.asp?pagename=Silent Auction&EventID=<%=eventID%>&Header=Silent Auction" class = "menu2"><center>Silent Auction</center></a></b></td>
		<% else %>
				<td  class = "tabBottomOff"   width = "90" height = "30" align = "center" ><b><a href =  "PageData2.asp?pagename=Silent Auction&Header=Silent Auction&EventID=<%=eventID%>" class = "menu"><center>Silent Auction</center></a></b></td>
		<% end if %>
    <% end if %>
    
    
   <% if  ShowStudAuction = True then %>
      <% if Current = "Stud Auction" then %>
    	<td class = "tabBottomOn"  width = "90" height = "30" align = "center" ><b><a href =  "PageData2.asp?pagename=Stud Auction&Header=Stud Auction&EventID=<%=eventID%>" class = "menu2"><center>Stud Auction</center></a></b></td>
      <% else %>
        <td  class = "tabBottomOff"  width = "90" height = "30" align = "center" ><b><a href = "PageData2.asp?pagename=Stud Auction&EventID=<%=eventID%>&Header=Stud Auction" class = "menu"><center>Stud Auction</center></a></b></td>
    <% end if %>

   <% end if %>

<% if ShowSpinOff = True then %>
<% if Current = "SpinOff" then %>
 <td class = "tabBottomOn"  width = "90" height = "30" align = "center" ><b><a href = "SpinOffHome.asp?EventID=<%=eventID%>" class = "menu2"><center>Spin-off</center></a></b></td>
 <% else %> 
 <td class = "tabBottomOff" width = "90" height = "30" align = "center" ><b><a href = "SpinOffHome.asp?EventID=<%=eventID%>" class = "menu"><center>Spin-Off</center></a></b></td>
	<% end if %>
   <% end if %>
 <td background = "images/BottomTabBlank.jpg">&nbsp;</td>
   </tr>
   </table>
   


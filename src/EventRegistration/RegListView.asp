<html>
<head>
<!--#Include file="GlobalVariables.asp"-->

<% pagename = "Reg List View"
EventID = request.querystring("EventID")
If Len(EventID) < 1 Then
	session("EventID") = regcuistID
Else
	session("EventID") = EventID
	session("regcustID") = EventID
End If 

iSubject=request.form("Subject") 
If Len(iSubject) < 3 then
	iSubject= Request.QueryString("Subject") 
End If

iState=request.form("State") 
iZip= Request.form("Zip") 
iRegion=request.form("Region") 


'response.write(iSubject)
CatID=request.form("CatID") 
If Len(CatID) < 3 then
	CatID= Request.QueryString("CatID") 
End If

If Len(CatID) < 1 then
   CatID = 0
End If 
%>


<% dim buttonimages(20)
dim buttontitle(20) 
Dim sSize(200)
Dim sExtraCost(200)
Dim cColor(200)
Dim Description
%>

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= WebSiteName %> Store</title>
<META name="description" content="<%= WebSiteName %> Store">
<META name="keywords" content="<%= WebSiteName %> Store">
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="<%=Style%>">

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
<script type="text/javascript" >


var ddimgtooltip={

	tiparray:function(){
		var tooltips=[]
		//define each tooltip below: tooltip[inc]=['path_to_image', 'optional desc', optional_CSS_object]
		//For desc parameter, backslash any special characters inside your text such as apotrophes ('). Example: "I\'m the king of the world"
		//For CSS object, follow the syntax: {property1:"cssvalue1", property2:"cssvalue2", etc}

<% sql = "select sfProducts.*, RegistryItems.*, sfcategories.CatName from SFProducts, RegistryItems, sfcategories where sfProducts.ProdID = RegistryItems.ProdID and sfcategories.catID = sfProducts.prodCategoryID and RegcustID = " & session("regcustID")

		'response.write(sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3 
If not rs.eof Then 
	count = 0
	 while not rs.eof
		image = "/uploads/" & rs("prodImage1")
		prodname = rs("prodname")
		response.write("count = " & count)
	 %>
					 
		tooltips[<%=count%>]=["<%=image %>", "<%=prodName %>", {width: "212px",  color:"black",  border:"5px ridge darkblue"}]
	<% count = count + 1
	rs.movenext
	wend
 end if 
%>

		


		return tooltips //do not remove/change this line
	}(),

	tooltipoffsets: [20, -30], //additional x and y offset from mouse cursor for tooltips

	//***** NO NEED TO EDIT BEYOND HERE

	tipprefix: 'imgtip', //tooltip ID prefixes

	createtip:function($, tipid, tipinfo){
		if ($('#'+tipid).length==0){ //if this tooltip doesn't exist yet
			return $('<div id="' + tipid + '" class="ddimgtooltip" />').html(
				'<div style="text-align:center"><img src="' + tipinfo[0] + '" /></div>'
				+ ((tipinfo[1])? '<div style="text-align:left; margin-top:5px">'+tipinfo[1]+'</div>' : '')
				)
			.css(tipinfo[2] || {})
			.appendTo(document.body)
		}
		return null
	},

	positiontooltip:function($, $tooltip, e){
		var x=e.pageX+this.tooltipoffsets[0], y=e.pageY+this.tooltipoffsets[1]
		var tipw=$tooltip.outerWidth(), tiph=$tooltip.outerHeight(), 
		x=(x+tipw>$(document).scrollLeft()+$(window).width())? x-tipw-(ddimgtooltip.tooltipoffsets[0]*2) : x
		y=(y+tiph>$(document).scrollTop()+$(window).height())? $(document).scrollTop()+$(window).height()-tiph-10 : y
		$tooltip.css({left:x, top:y})
	},
	
	showbox:function($, $tooltip, e){
		$tooltip.show()
		this.positiontooltip($, $tooltip, e)
	},

	hidebox:function($, $tooltip){
		$tooltip.hide()
	},


	init:function(targetselector){
		jQuery(document).ready(function($){
			var tiparray=ddimgtooltip.tiparray
			var $targets=$(targetselector)
			if ($targets.length==0)
				return
			var tipids=[]
			$targets.each(function(){
				var $target=$(this)
				$target.attr('rel').match(/\[(\d+)\]/) //match d of attribute rel="imgtip[d]"
				var tipsuffix=parseInt(RegExp.$1) //get d as integer
				var tipid=this._tipid=ddimgtooltip.tipprefix+tipsuffix //construct this tip's ID value and remember it
				var $tooltip=ddimgtooltip.createtip($, tipid, tiparray[tipsuffix])
				$target.mouseenter(function(e){
					var $tooltip=$("#"+this._tipid)
					ddimgtooltip.showbox($, $tooltip, e)
				})
				$target.mouseleave(function(e){
					var $tooltip=$("#"+this._tipid)
					ddimgtooltip.hidebox($, $tooltip)
				})
				$target.mousemove(function(e){
					var $tooltip=$("#"+this._tipid)
					ddimgtooltip.positiontooltip($, $tooltip, e)
				})
				if ($tooltip){ //add mouseenter to this tooltip (only if event hasn't already been added)
					$tooltip.mouseenter(function(){
						ddimgtooltip.hidebox($, $(this))
					})
				}
			})

		}) //end dom ready
	}
}

//ddimgtooltip.init("targetElementSelector")
ddimgtooltip.init("*[rel^=imgtip]")

</script>
</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include file="Header.asp"--> 
<!--#Include file="Scripts.asp"--> 
<!--#Include file="regHeader.asp"-->



	<form  action="RegEditlist.asp" method="post">
<table border = "0" width = "790" align = "right"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>
		<td class ="body" valign = "top" >
			<h1>Event Listing</h1>
		</td>
	</tr>
	<tr>
				<td class = "body" align ="left" bgcolor = "#670000" height = "1"><img src = "images/px.gif" height = "1"></td>
			</tr>
	
  <tr>
	   <td valign = "top" class = "body" ><br>
	  
			
					<% sql = "select sfProducts.*, RegistryItems.*, sfcategories.CatName from SFProducts, RegistryItems, sfcategories where sfProducts.ProdID = RegistryItems.ProdID and sfcategories.catID = sfProducts.prodCategoryID and RegcustID = " & session("regcustID")

		'response.write(sql)
					Set rs = Server.CreateObject("ADODB.Recordset")
					 rs.Open sql, conn, 3, 3 
					 If rs.eof Then %>
					 0 Items Selected

					<% Else %>
					<table border="0" cellspacing="5" cellpadding="5" leftmargin="5" topmargin="5" marginwidth="5" marginheight="5"  align = "center"  valign ="top"  width = "750">

			<tr bgcolor = "burlywood">
				
				<td class = "body" align = "center" width = "50">Item #</td>
				<td class = "body" align = "center">Item</td>
				<td class = "body" align = "center">Price</td>
				<td class = "body" align = "center" width = "90"># Requested</td>
				<td class = "body" align = "center" width = "60"># Bought</td>
				<td class = "body" align = "center" width = "50"># Left</td>
				<td class = "body" align = "center" width = "50">&nbsp;</td>
			</tr>
<%
count = 0
While not rs.eof 
%>
<tr><td class = "body" align = "center"><%= rs("sfProducts.prodID") %>
		<input type="hidden" name="ProdID(<%=count%>)"  value = "<%= rs("sfProducts.prodID") %>">
</td>
<td class = "body" ><b>
<a href="RegProductDetails.asp?prodid=<%= rs("sfProducts.prodID") %>" rel="imgtip[<%=count%>]" class = "body"><img src = "<%= "/uploads/" & rs("prodImage1")%>" width = "25" border = "0"></a>


<a href="RegProductDetails.asp?prodid=<%= rs("sfProducts.prodID") %>"  class = "body"><%= rs("prodName") %></a></b></td>
<td class = "body" align = "center"><%= FormatCurrency(rs("prodPrice")) %></td>
<td class = "body" align = "center"><%= rs("RequestedNumber") %></td>
<td class = "body" align = "center"><%= rs("PurchasedNumber") %></td>
<td class = "body" align = "center"><%= rs("RequestedNumber") - rs("PurchasedNumber") %></td>
<td class = "body" align = "center"><b>
<a href="RegProductDetails.asp?prodid=<%= rs("sfProducts.prodID") %>"  class = "body">Learn More / Buy</a></td>
</tr>
<% count = count + 1
	rs.movenext
	Wend
	TotalCount = count - 1 %>
</table>
					<div align = "right">
					<input type="hidden" name="TotalCount"  value = "<%= TotalCount %>">
		
					
					</form>

					<%
					End If 
					%>

					
		
		
		<br><br><br>
   	</td>
</tr>
</table>

 <!--#Include file="Footer.asp"--> 
</body>
</html>

